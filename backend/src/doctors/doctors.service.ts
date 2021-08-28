import {
  ConflictException, Injectable, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationService } from 'src/base/registration.service';
import { BufferedFile } from 'src/minio-client/file.model';
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
    private registrationService: RegistrationService
  ) { }

  async create(createDto: CreateDoctorDto, bufferedFile: BufferedFile) {
    try {
      const validatedEntity = await this.registrationService.validateUniqueFieldConstraints(this.doctorRepository, createDto);
      const entity = await this.mapDtoToEntity(createDto, validatedEntity as Doctor);
      await this.registrationService.applyImageUrl(bufferedFile, entity, 'doctors');
      await this.doctorRepository.save(entity);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw error;
    }
  }

  private async mapDtoToEntity(createDto: CreateDoctorDto, doctor: Doctor): Promise<Doctor> {
    const { specializedFields, ...restCreateDto } = createDto;
    const entity = Object.assign(doctor, restCreateDto);
    entity.specializedFields = await this.specializedFieldRepository.find({
      where: { label: In(specializedFields) }
    }) || [];
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
    const { specializedFields, ...restEntities } = doctor;
    const responseDto = Object.assign(new responseDoctorDto(), restEntities);
    responseDto.specializedFields = specializedFields.map(specializedField => specializedField.label);
    responseDto.verification = await this.registrationService.populateVerification(doctor, 'doctors', this.docVerificationRepository);
    return responseDto;
  }

  async findOneFile(nationalId: number, filename: string): Promise<any> {
    const objectName = `doctors/${nationalId}/${filename}`;
    return await this.registrationService.findOneFile(this.doctorRepository, nationalId, objectName);
  }

  async checkStatus(nationalId: number): Promise<any> {
    return this.registrationService.checkStatus(nationalId, this.doctorRepository,
      this.docVerificationRepository, 'doctor');
  }

  async updateStatus(id: number, verificationDto: VerificationDto) {
    try {
      const doctor = await this.doctorRepository.findOne(id, {
        relations: ['specializedFields']
      });
      if (!doctor) {
        throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
      }
      const user = await this.userRepository.findOne(verificationDto.verifiedById);
      if (!user) {
        throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
      }
      const docVerification = await this.findVerificationStatus(doctor, user, verificationDto);
      await this.registrationService.sendDataToTelemed(docVerification, 'doctors');
      await this.docVerificationRepository.save(docVerification);
    } catch (error) {
      throw error;
    }
  }

  private async findVerificationStatus(doctor: Doctor, user: User, verificationDto: VerificationDto): Promise<DoctorVerification> {
    let docVerification = await this.docVerificationRepository.findOne({
      where: { doctor: { id: doctor.id }, verifiedBy: { id: user.id } },
      relations: ['doctor', 'verifiedBy']
    });
    if (!docVerification) {
      docVerification = new DoctorVerification();
      docVerification.doctor = doctor;
      docVerification.verifiedBy = user;
    }
    docVerification.doctor.status = verificationDto.status;
    docVerification.status = verificationDto.status;
    docVerification.statusNote = verificationDto.statusNote;
    docVerification.updatedTime = new Date();
    return docVerification;
  }

  async remove(id: number): Promise<void> {
    await this.doctorRepository.delete(id);
  }

}