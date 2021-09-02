import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { DoctorVerification } from 'src/doctors/entities/doctor-verification.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { VerificationStatus } from 'src/enum/verification-status.enum';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { VolunteerVerification } from 'src/volunteers/entities/volunteer-verification.entity';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';
import { Stream } from 'stream';
import { FindConditions, FindOneOptions, In, Repository } from 'typeorm';
import { CreateDoctorDto } from '../doctors/dto/create-doctor.dto';
import { SpecializedField } from '../doctors/entities/specialized-field.entity';
import { LinePushMessageDto } from '../line-message/dto/line-push-message.dto';
import { LineMessageService } from '../line-message/line-message.service';
import { BufferedFile } from '../minio-client/file.model';
import { TelemedRequestDto } from '../telemed/dto/telemed-request.dto';
import { TelemedService } from '../telemed/telemed.service';
import { maskId } from '../util/util-functions';
import { CreateVolunteerDto } from '../volunteers/dto/create-volunteer.dto';
import { VolunteerDepartment } from '../volunteers/entities/volunteer-department.entity';
import { VerificationResponseDto } from './dto/verification-response.dto';

@Injectable()
export class RegistrationService {

  private readonly logger = new Logger(RegistrationService.name);

  constructor(
    private minioClientService: MinioClientService,
    private telemedService: TelemedService,
    private lineMessageService: LineMessageService
  ) { }

  readonly doctorRequiredFiles = ['idCard', 'idCardSelfie', 'medCertificate', 'medCertificateSelfie'];
  readonly volunteerRequiredFiles = ['idCard', 'idCardSelfie'];
  readonly notDeniedStatusList = [VerificationStatus.PENDING, VerificationStatus.APPROVED];

  async getRegisterInfo(nationalId: number, repository: Repository<Doctor | Volunteer>): Promise<any> {
    const entity = await repository.findOne({
      select: ['nationalId'],
      where: { nationalId, status: In(this.notDeniedStatusList) }
    });
    if (!entity) {
      return {};
    }
    return entity;
  }

  public findAll(repository: Repository<Doctor | Volunteer>): Promise<any[]> {
    return repository.find({
      select: ['id', 'createdTime', 'initial', 'firstName', 'lastName', 'status']
    });
  }

  public async validateUniqueFieldConstraints(
    repository: Repository<Doctor | Volunteer>,
    createDto: CreateDoctorDto | CreateVolunteerDto
  ): Promise<Doctor | Volunteer> {
    const { nationalId, firstName, lastName, contactNumber,
      lineUserId, medCertificateId } = createDto;

    const where: FindConditions<Doctor | Volunteer>[] = [
      { nationalId }, { firstName, lastName }, { contactNumber }, { lineUserId }
    ];
    if (medCertificateId) where.push({ medCertificateId })

    const entity = await repository.findOne({ where });
    if (entity) {
      if (this.hasNotDenied(entity.status)) {
        const errors = [];
        if (nationalId == entity.nationalId) {
          errors.push({ field: 'nationalId', value: nationalId, text: 'เลขประจำตัวประชาชน' });
        }
        if (firstName === entity.firstName && lastName === entity.lastName) {
          errors.push({ field: 'firstName, lastName', value: `${firstName} ${lastName}`, text: 'ชื่อ-นามสกุล' });
        }
        if (contactNumber == entity.contactNumber) {
          errors.push({ field: 'contactNumber', value: contactNumber, text: 'หมายเลขโทรศัพท์' });
        }
        if (lineUserId === entity.lineUserId) {
          errors.push({ field: 'lineUserId', value: lineUserId, text: 'LINE USER ID' });
        }
        if (medCertificateId && (medCertificateId == entity.medCertificateId)) {
          errors.push({ field: 'medCertificateId', value: medCertificateId, text: 'เลขที่ใบประกอบวิชาชีพเวชกรรม' });
        }
        if (errors.length > 0) throw new ConflictException(errors);
      } else {
        entity.status = VerificationStatus.PENDING;
        entity.createdTime = new Date();
        return entity;
      }
    }
    return {} as any;
  }

  private hasNotDenied(status: VerificationStatus): boolean {
    return this.notDeniedStatusList.includes(status);
  }

  public async applyImageUrl(bufferedFile: BufferedFile, entity: Doctor | Volunteer, role: 'doctors' | 'volunteers') {
    let resultObject = { idCardUrl: null, idCardSelUrl: null, jobCerUrl: null, jobCerSelUrl: null };
    this.checkFileRequirement(Object.keys(bufferedFile), role);
    const objectPrefix = `${role}/${entity.nationalId}/`;
    await this.minioClientService.deleteAllFilesIfExist(objectPrefix);
    resultObject = await this.minioClientService.uploadBufferedFile(bufferedFile, objectPrefix);
    entity.idCardImg = resultObject.idCardUrl;
    entity.idCardSelfieImg = resultObject.idCardSelUrl;
    entity.jobCertificateImg = resultObject.jobCerUrl;
    entity.jobCertificateSelfieImg = resultObject.jobCerSelUrl;
  }

  public async checkStatus(
    nationalId: number,
    repository: Repository<Doctor | Volunteer>,
    verificationRepository: Repository<DoctorVerification | VolunteerVerification>,
    role: 'doctor' | 'volunteer'
  ): Promise<any> {
    const entity = await repository.findOne({
      select: ['id', 'status'],
      where: { nationalId }
    });
    if (!entity) {
      return {};
    }

    const options: FindOneOptions<DoctorVerification | VolunteerVerification> = {
      order: { updatedTime: 'DESC' }
    };
    options.where = role === 'doctor'
      ? { doctor: { id: entity.id } }
      : { volunteer: { id: entity.id } };
    const verification = await verificationRepository.findOne(options);
    const responseDto: any = { status: entity.status };
    if (entity.status !== VerificationStatus.PENDING && verification) {
      responseDto.statusNote = verification.statusNote;
      responseDto.updatedTime = verification.updatedTime;
    }
    return responseDto;
  }

  private checkFileRequirement(bufferedFileKeys: string[], role: 'doctors' | 'volunteers') {
    const requiredFiles = role === 'doctors' ? this.doctorRequiredFiles : this.volunteerRequiredFiles;
    const pass = bufferedFileKeys.length !== 0 && requiredFiles.every(field => bufferedFileKeys.includes(field));
    if (!pass) {
      throw new BadRequestException(`${requiredFiles.join(', ')} are required`);
    }
  }

  public async findOneFile(repository: Repository<Doctor | Volunteer>, nationalId: number, objectName: string): Promise<Stream> {
    const entity = await repository.findOne({ where: { nationalId } });
    if (!entity) {
      throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
    }
    return await this.minioClientService.get(objectName);
  }

  public async populateVerification(
    entity: Doctor | Volunteer,
    role: 'doctors' | 'volunteers',
    verificationRepository: Repository<DoctorVerification | VolunteerVerification>): Promise<VerificationResponseDto> {
    let resultVerification: VerificationResponseDto = null;
    const where: FindConditions<Doctor | Volunteer> = role === 'doctors'
      ? { doctor: { id: entity.id } } as FindConditions<Doctor>
      : { volunteer: { id: entity.id } } as FindConditions<Volunteer>;
    const verification = await verificationRepository.findOne({
      where, relations: ['verifiedBy'],
      order: { updatedTime: 'DESC' }
    });
    if (verification) {
      const { status, statusNote, updatedTime, verifiedBy } = verification;
      resultVerification = {
        status, statusNote, updatedTime,
        verifiedBy: {
          firstName: verifiedBy.firstName,
          lastName: verifiedBy.lastName,
          contactNumber: verifiedBy.contactNumber
        }
      };
    }
    return resultVerification;
  }

  public async sendDataToTelemed(
    verification: DoctorVerification | VolunteerVerification,
    role: 'doctors' | 'volunteers'
  ): Promise<void> {
    try {
      let body = this.buildTelemedRequestBody(verification, role);
      if (role === 'doctors') {
        body = { userName: '', password: '', userGroup: '', ...body };
      }
      const response = await this.telemedService.submitData(body, role);
      this.logger.log(`Successfully submitted data to telemed with status: ${response.data.status}`);
    } catch (error) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage.includes('หมายเลขบัตรประชาชน')) {
        Promise.resolve();
      } else {
        this.logger.error(`Failed to submit data to telemed, due to error: ${errorMessage ? errorMessage : error}`);
        throw new ServiceUnavailableException(`Failed to submit data to telemed, due to error: ${errorMessage ? errorMessage : error}`);
      }
    }
  }

  private buildTelemedRequestBody(
    verification: DoctorVerification | VolunteerVerification,
    role: 'doctors' | 'volunteers'
  ): TelemedRequestDto {
    const entity = role === 'doctors'
      ? (verification as DoctorVerification).doctor
      : (verification as VolunteerVerification).volunteer;
    const { nationalId, initial, gender, firstName, lastName,
      lineUserId, contactNumber, dateOfBirth, medCertificateId } = entity;
    const verifyBy = `${verification.verifiedBy.firstName} ${verification.verifiedBy.lastName}`;
    const verifyDate = verification.updatedTime.toISOString();
    return {
      citizenId: nationalId, prefix: initial, firstName, lastName, lineId: lineUserId || '', telephone: contactNumber,
      email: '', gendor: gender, dateOfBirth: dateOfBirth.toISOString(), medicalCertificate: medCertificateId ? medCertificateId + '' : '',
      departmentName: this.buildDepartmentName(entity, role), verifyBy, verifyDate, remark: verification?.statusNote || ''
    };
  }

  private buildDepartmentName(entity: any, role: 'doctors' | 'volunteers'): string {
    let departmentName = '';
    if (role === 'doctors') {
      const specializedFields = entity.specializedFields.map((specializedField: SpecializedField) => specializedField.label);
      departmentName = specializedFields.join(', ');
    } else {
      const departments = entity.volunteerDepartments.map((volDep: VolunteerDepartment) => volDep.department.label);
      departmentName = departments.join(', ');
    }
    return departmentName;
  }

  public async sendPushMessage(entity: any): Promise<void> {
    try {
      const { nationalId, initial, firstName, lastName, lineUserId } = entity;
      const fullName = `${initial} ${firstName} ${lastName}`;
      const body: LinePushMessageDto = {
        to: lineUserId, messages: [{
          type: 'text',
          text: `ข้อความยืนยันการลงทะเบียนของ ${fullName} ที่มีเลขประจำตัวประชาชน ${maskId(nationalId)} ได้รับการอนุมัติเรียบร้อยแล้ว`
        }]
      };
      this.lineMessageService.sendPushMessage(body);
      this.logger.log(`Successfully sent push message via LINE message API with body: ${body}`);
    } catch (error) {
      this.logger.error(`Failed to execute #sendPushMessage with error: ${error}`);
      throw error;
    }
  }

}