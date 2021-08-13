import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DoctorVerification } from 'src/doctors/entities/doctor-verification.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { VerificationStatus } from 'src/enum/verification-status.enum';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { VolunteerVerification } from 'src/volunteers/entities/volunteer-verification.entity';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';
import { Stream } from 'stream';
import { FindOneOptions, In, Repository } from 'typeorm';
import { CreateDoctorDto } from '../doctors/dto/create-doctor.dto';
import { BufferedFile } from '../minio-client/file.model';
import { CreateVolunteerDto } from '../volunteers/dto/create-volunteer.dto';

@Injectable()
export class RegistrationService {

  constructor(private minioClientService: MinioClientService) { }

  readonly doctorRequiredFiles = ['idCard', 'idCardSelfie', 'medCertificate', 'medCertificateSelfie'];
  readonly volunteerRequiredFiles = ['idCard', 'idCardSelfie'];

  async getRegisterInfo(nationalId: number, repository: Repository<Doctor | Volunteer>): Promise<any> {
    const entity = await repository.findOne({
      select: ['nationalId'],
      where: { nationalId, status: In([VerificationStatus.PENDING, VerificationStatus.APPROVED]) }
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
  ) {
    const { nationalId, firstName, lastName, contactNumber, lineId, medCertificateId } = createDto;
    const entity = await repository.findOne({
      where: [{ nationalId }, { firstName, lastName }, { contactNumber }, { lineId }, { medCertificateId }]
    });
    if (entity) {
      const errors = [];
      if (nationalId == entity.nationalId) {
        errors.push({ field: 'nationalId', value: nationalId, text: 'เลขประจำตัวประชาชน' });
      }
      if (firstName === entity.firstName && lastName === entity.lastName) {
        errors.push({ field: 'firstName,lastName', value: `${firstName} ${lastName}`, text: 'ชื่อ-นามสกุล' });
      }
      if (contactNumber == entity.contactNumber) {
        errors.push({ field: 'contactNumber', value: contactNumber, text: 'หมายเลขโทรศัพท์' });
      }
      if (lineId === entity.lineId) {
        errors.push({ field: 'lineId', value: lineId, text: 'LINE ID' });
      }
      if (medCertificateId == entity.medCertificateId) {
        errors.push({ field: 'medCertificateId', value: medCertificateId, text: 'เลขที่ใบประกอบวิชาชีพเวชกรรม' });
      }
      throw new ConflictException(errors);
    }
  }

  public async checkIfNationalIdAlreadyExisted(repository: Repository<Doctor | Volunteer>, nationalId: string) {
    const entity = await repository.findOne({ where: { nationalId } });
    if (entity) {
      if ([VerificationStatus.PENDING, VerificationStatus.APPROVED].includes(entity.status)) {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      } else {
        entity.status = VerificationStatus.PENDING;
        return entity;
      }
    }
    return {};
  }

  public async applyImageUrl(bufferedFile: BufferedFile, entity: Doctor | Volunteer, role: 'doctors' | 'volunteers') {
    let resultObject = { idCardUrl: null, idCardSelUrl: null, jobCerUrl: null, jobCerSelUrl: null };
    this.checkFileRequirement(Object.keys(bufferedFile), role);
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

}