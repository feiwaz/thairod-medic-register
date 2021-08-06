import {
  ConflictException, Injectable,
  InternalServerErrorException,
  NotFoundException
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

  async create(createDoctorDto: CreateDoctorDto, imageFiles: BufferedFile) {
    try {
      const doctor = await this.mapDtoToEntity(createDoctorDto);
      const nId = createDoctorDto.nationalId
      const suffix = "-doc"
      const idCardImg = createDoctorDto['idCard'][0]
      const idCardRes = await this.minioClientService.upload(idCardImg, nId + suffix, nId + "_ID_card")
      const idCardSelImg = imageFiles['idCardSelfie'][0]
      const idCardSelRes = await this.minioClientService.upload(idCardSelImg, nId + suffix, nId + "_ID_card_selfie")
      const jobCerImg = imageFiles['medCertificate'][0]
      const jobCerRes = await this.minioClientService.upload(jobCerImg, nId + suffix, nId + "_Job_cer")
      const jobCerSelImg = imageFiles['medCertificateSelfie'][0]
      const jobCerSelRes = await this.minioClientService.upload(jobCerSelImg, nId + suffix, nId + "_Job_cer_selfie")
      doctor.idCardImg = idCardRes.url
      doctor.idCardSelfieImg = idCardSelRes.url
      doctor.jobCertificateImg = jobCerRes.url
      doctor.jobCertificateSelfieImg = jobCerSelRes.url
      await this.doctorRepository.save(doctor);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw new InternalServerErrorException();
    }
  }

  private async mapDtoToEntity(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const { specializedFields, ...doctorEntities } = createDoctorDto;
    const savedSpecializedFields = await this.specializedFieldRepository.find({
      where: { label: In(specializedFields) }
    });
    const doctor = Object.assign(new Doctor(), doctorEntities);
    doctor.specializedFields = savedSpecializedFields || [];
    return doctor;
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
