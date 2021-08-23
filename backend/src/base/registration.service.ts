import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { DoctorVerification } from 'src/doctors/entities/doctor-verification.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { VerificationStatus } from 'src/enum/verification-status.enum';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { VolunteerVerification } from 'src/volunteers/entities/volunteer-verification.entity';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';
import { Stream } from 'stream';
import { FindConditions, FindOneOptions, In, Repository } from 'typeorm';
import { CreateDoctorDto } from '../doctors/dto/create-doctor.dto';
import { BufferedFile } from '../minio-client/file.model';
import { TelemedRequestDto } from '../telemed/dto/telemed-request.dto';
import { TelemedService } from '../telemed/telemed.service';
import { CreateVolunteerDto } from '../volunteers/dto/create-volunteer.dto';
import { VerificationResponseDto } from './dto/verification-response.dto';

@Injectable()
export class RegistrationService {

  constructor(
    private minioClientService: MinioClientService,
    private telemedService: TelemedService
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
    const { nationalId, firstName, lastName, contactNumber, lineId, medCertificateId } = createDto;

    const where: FindConditions<Doctor | Volunteer>[] = [
      { nationalId }, { firstName, lastName }, { contactNumber }, { lineId }
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
        if (lineId === entity.lineId) {
          errors.push({ field: 'lineId', value: lineId, text: 'LINE ID' });
        }
        if (medCertificateId && (medCertificateId == entity.medCertificateId)) {
          errors.push({ field: 'medCertificateId', value: medCertificateId, text: 'เลขที่ใบประกอบวิชาชีพเวชกรรม' });
        }
        if (errors.length > 0) throw new ConflictException(errors);
      } else {
        entity.status = VerificationStatus.PENDING;
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
    await this.minioClientService.deleteAllFilesIfExist(role, entity.nationalId);
    resultObject = await this.minioClientService.uploadBufferedFile(bufferedFile, role, entity.nationalId);
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
        status: status,
        statusNote: statusNote,
        updatedTime: updatedTime,
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
    entity: Doctor | Volunteer,
    verification: DoctorVerification | VolunteerVerification
  ): Promise<void> {
    try {
      const body = this.buildTelemedRequestBody(entity, verification);
      await this.telemedService.submitData(body);
      console.log('Successfully submit data to telemed');
    } catch (error) {
      throw new ServiceUnavailableException(`Failed to submit data to telemed, due to error: ${error}`);
    }
  }

  private buildTelemedRequestBody(
    entity: Doctor | Volunteer,
    verification: DoctorVerification | VolunteerVerification
  ): TelemedRequestDto {
    const { nationalId, initial, firstName, lastName, lineId,
      contactNumber, dateOfBirth, medCertificateId } = entity;
    const verifyBy = `${verification.verifiedBy.firstName} ${verification.verifiedBy.lastName}`;
    const verifyDate = verification.updatedTime.toISOString();
    return {
      citizenId: nationalId, prefix: initial, firstName, lastName, lineId, telephone: contactNumber,
      email: 'hard.coded@no-reply.com', gendor: this.findGenderFromInitial(initial),
      dateOfBirth: dateOfBirth.toISOString(), medicalCertificate: medCertificateId + '',
      departmentName: 'hard-coded-department', verifyBy, verifyDate, remark: 'hard-coded-remark'
    };
  }

  private findGenderFromInitial(initial: string): string {
    const males = ['นายแพทย์', 'เภสัชกรชาย', 'นาย', 'เด็กชาย'];
    return males.includes(initial) ? 'male' : 'femail';
  }

}