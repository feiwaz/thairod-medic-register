import {
  BadRequestException,
  ConflictException, Injectable, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { RegistrationStatusDto } from 'src/users/dto/registration-status.dto';
import { In, Repository } from 'typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { responseDoctorDto } from './dto/response-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { SpecializedField } from './entities/specializedField.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(SpecializedField)
    private specializedFieldRepository: Repository<SpecializedField>,
    private minioClientService: MinioClientService
  ) { }

  async create(createDto: CreateDoctorDto, bufferedFile: BufferedFile) {
    await this.checkIfNationalIdAlreadyExisted(createDto.nationalId);
    try {
      const entity = await this.mapDtoToEntity(createDto);
      let resultObject = { idCardUrl: null, idCardSelUrl: null, jobCerUrl: null, jobCerSelUrl: null };
      this.checkFileRequirement(bufferedFile);
      resultObject = await this.minioClientService.uploadBufferedFile(createDto.nationalId, bufferedFile);
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

  private checkFileRequirement(bufferedFile: any) {
    const requiredFields = ['idCard', 'idCardSelfie', 'medCertificate', 'medCertificateSelfie'];
    const pass = Object.keys(bufferedFile).length !== 0 && requiredFields.every(field => Object.keys(bufferedFile).includes(field));
    if (!pass) {
      throw new BadRequestException(`${requiredFields.join(', ')} are required`);
    }
  }

  private async checkIfNationalIdAlreadyExisted(nationalId: string) {
    const entity = await this.doctorRepository.findOne({ where: { nationalId } });
    if (entity) {
      throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
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

  findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find({
      relations: ['specializedFields'],
      order: { updatedTime: 'DESC' }
    });
  }

  async findOne(nationalId: number): Promise<responseDoctorDto> {
    const doctor = await this.doctorRepository.findOne({
      where: { nationalId },
      relations: ['specializedFields']
    });
    if (!doctor) {
      return {} as responseDoctorDto;
    }
    return this.mapEntityToDto(doctor);
  }

  private mapEntityToDto(doctor: Doctor) {
    const { specializedFields, ...doctorEntities } = doctor;
    const responseDto = Object.assign(new responseDoctorDto(), doctorEntities);
    responseDto.specializedFields = specializedFields.map(specializedField => specializedField.label);
    return responseDto;
  }

  async remove(id: number): Promise<void> {
    await this.doctorRepository.delete(id);
  }

  async updateStatus(id: number, verifyStatusDto: RegistrationStatusDto) {
    const response = await this.doctorRepository.update(id, { status: verifyStatusDto.status });
    if (response.affected === 0) {
      throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
    }
  }
}
