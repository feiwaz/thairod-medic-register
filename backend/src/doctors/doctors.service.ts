import {
  ConflictException, Injectable, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationService } from 'src/base/registration.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { VerificationDto } from 'src/users/dto/verification.dto';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { responseDoctorDto } from './dto/response-doctor.dto';
import { DoctorVerification } from './entities/doctor-verification.entity';
import { Doctor } from './entities/doctor.entity';
import { SpecializedField } from './entities/specialized-field.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(SpecializedField)
    private specializedFieldRepository: Repository<SpecializedField>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DoctorVerification)
    private docVerificationRepository: Repository<DoctorVerification>,
    private minioClientService: MinioClientService,
    private registrationService: RegistrationService
  ) { }

  async create(createDto: CreateDoctorDto, bufferedFile: BufferedFile) {
    await this.registrationService.checkIfNationalIdAlreadyExisted(this.doctorRepository, createDto.nationalId);
    try {
      const entity = await this.mapDtoToEntity(createDto);
      let resultObject = { idCardUrl: null, idCardSelUrl: null, jobCerUrl: null, jobCerSelUrl: null };
      this.registrationService.checkFileRequirement(Object.keys(bufferedFile), 'doctor');
      resultObject = await this.minioClientService.uploadBufferedFile(bufferedFile, 'doc', createDto.nationalId);
      entity.idCardImg = resultObject.idCardUrl;
      entity.idCardSelfieImg = resultObject.idCardSelUrl;
      entity.jobCertificateImg = resultObject.jobCerUrl;
      entity.jobCertificateSelfieImg = resultObject.jobCerSelUrl;
      await this.doctorRepository.save(entity);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw error;
    }
  }

  private async mapDtoToEntity(createDto: CreateDoctorDto): Promise<Doctor> {
    const { specializedFields, ...restCreateDto } = createDto;
    const savedSpecializedFields = await this.specializedFieldRepository.find({
      where: { label: In(specializedFields) }
    });
    const entity = Object.assign(new Doctor(), restCreateDto);
    entity.specializedFields = savedSpecializedFields || [];
    return entity;
  }

  async getRegisterInfo(nationalId: number): Promise<any> {
    return this.registrationService.getRegisterInfo(nationalId, this.doctorRepository);
  }

  findAll(): Promise<Doctor[]> {
    return this.registrationService.findAll(this.doctorRepository);
  }

  async findOne(id: number): Promise<responseDoctorDto> {
    const doctor = await this.doctorRepository.findOne(id, {
      relations: ['specializedFields']
    });
    if (!doctor) {
      throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
    }
    return await this.mapEntityToDto(doctor);
  }

  private async mapEntityToDto(doctor: Doctor) {
    const { specializedFields, ...doctorEntities } = doctor;
    const responseDto = Object.assign(new responseDoctorDto(), doctorEntities);
    responseDto.specializedFields = specializedFields.map(specializedField => specializedField.label);

    const verification = await this.docVerificationRepository.findOne({
      where: { doctor: { id: doctor.id } },
      relations: ['verifiedBy'],
      order: { updatedTime: 'DESC' }
    });
    responseDto.verification = { statusNote: null };
    if (verification) {
      responseDto.verification.statusNote = verification.statusNote
    }

    return responseDto;
  }

  async checkStatus(nationalId: number): Promise<any> {
    return this.registrationService.checkStatus(nationalId, this.doctorRepository,
      this.docVerificationRepository, 'doctor');
  }

  async updateStatus(id: number, verificationDto: VerificationDto) {
    try {
      const doctor = await this.doctorRepository.findOne(id);
      if (!doctor) {
        throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
      }
      const user = await this.userRepository.findOne(verificationDto.verifiedById);
      if (!user) {
        throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
      }
      let docVerification = await this.docVerificationRepository.findOne({
        where: { doctor: { id: doctor.id }, verifiedBy: { id: user.id } },
        relations: ['doctor', 'verifiedBy']
      });
      console.log(docVerification)
      if (!docVerification) {
        docVerification = new DoctorVerification();
        docVerification.doctor = doctor;
        docVerification.verifiedBy = user;
      }
      docVerification.doctor.status = verificationDto.status;
      docVerification.status = verificationDto.status;
      docVerification.statusNote = verificationDto.statusNote;
      this.docVerificationRepository.save(docVerification);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.doctorRepository.delete(id);
  }

}