import {
  BadRequestException,
  ConflictException,
  Injectable, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { RegistrationStatusDto } from 'src/users/dto/registration-status.dto';
import { UserStatus } from 'src/users/entities/user.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import {
  FindOneVolunteerDto
} from './dto/find-one-volunteer.dto';
import { VolunteerDepartmentDto } from './dto/volunteer-department.dto';
import { VolunteerDepartmentsDto } from './dto/volunteer-departments.dto';
import { Department } from './entities/department.entity';
import { Volunteer } from './entities/volunteer.entity';
import { VolunteerDepartment } from './entities/volunteerDepartment.entity';

@Injectable()
export class VolunteersService {

  constructor(
    @InjectRepository(Volunteer)
    private volunteerRepository: Repository<Volunteer>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(VolunteerDepartment)
    private volunteerDepartmentRepository: Repository<VolunteerDepartment>,
    private minioClientService: MinioClientService
  ) { }

  async create(createDto: CreateVolunteerDto, bufferedFile: BufferedFile) {
    await this.checkIfNationalIdAlreadyExisted(createDto.nationalId);
    try {
      const entity = await this.mapDtoToEntity(createDto);
      let resultObject = { idCardUrl: null, idCardSelUrl: null, jobCerUrl: null, jobCerSelUrl: null };
      this.checkFileRequirement(bufferedFile);
      resultObject = await this.minioClientService.uploadBufferedFile(bufferedFile, 'vol', createDto.nationalId);
      entity.idCardImg = resultObject.idCardUrl;
      entity.idCardSelfieImg = resultObject.idCardSelUrl;
      entity.jobCertificateImg = resultObject.jobCerUrl;
      entity.jobCertificateSelfieImg = resultObject.jobCerSelUrl;
      await this.volunteerRepository.save(entity);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw error;
    }
  }

  private checkFileRequirement(bufferedFile: any) {
    const requiredFields = ['idCard', 'idCardSelfie'];
    const pass = Object.keys(bufferedFile).length !== 0 && requiredFields.every(field => Object.keys(bufferedFile).includes(field));
    if (!pass) {
      throw new BadRequestException(`${requiredFields.join(', ')} are required`);
    }
  }

  private async checkIfNationalIdAlreadyExisted(nationalId: string) {
    const entity = await this.volunteerRepository.findOne({ where: { nationalId } });
    if (entity) {
      throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
    }
  }

  private async mapDtoToEntity(createDto: CreateVolunteerDto): Promise<Volunteer> {
    const { departments, ...restCreateDto } = createDto;
    const savedDepartments = await this.departmentRepository.find({
      where: { label: In(departments) }
    });
    const entity = Object.assign(new Volunteer(), restCreateDto);
    entity.volunteerDepartments = savedDepartments.map(department => ({
      departmentId: department.id
    } as VolunteerDepartment)) || [];
    return entity;
  }

  findAll(status?: UserStatus): Promise<Volunteer[]> {
    const options: FindManyOptions<Volunteer> = {
      relations: ['volunteerDepartments', 'volunteerDepartments.department'],
      order: { updatedTime: 'DESC' }
    };
    if (status) {
      options.where = { status };
    }
    const volunteers = this.volunteerRepository.find(options);
    return volunteers;
  }

  async findOne(nationalId: number): Promise<FindOneVolunteerDto> {
    const volunteer = await this.volunteerRepository.findOne({ where: { nationalId } });
    if (!volunteer) {
      return {} as FindOneVolunteerDto;
    }
    return await this.mapEntityToDto(volunteer);
  }

  private async mapEntityToDto(volunteer: Volunteer): Promise<FindOneVolunteerDto> {
    const responseDto = Object.assign(new FindOneVolunteerDto(), volunteer);
    const volunteerDepartments = await this.volunteerDepartmentRepository.find({
      where: { volunteerId: volunteer.id },
      relations: ['department']
    });
    responseDto.departments = volunteerDepartments.map(volunteerDepartment => ({
      label: volunteerDepartment.department.label,
      isTrainingRequired: volunteerDepartment.department.isTrainingRequired,
      trainingStatus: volunteerDepartment.trainingStatus
    }));
    return responseDto;
  }

  async remove(id: number): Promise<void> {
    await this.volunteerRepository.delete(id);
  }

  async updateStatus(id: number, verifyStatusDto: RegistrationStatusDto) {
    const response = await this.volunteerRepository.update(id, { status: verifyStatusDto.status });
    if (response['affected'] === 0) {
      throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
    }
  }

  async updateTrainingStatus(id: number, volunteerDepartmentsDto: VolunteerDepartmentsDto) {
    try {
      const volunteer = await this.volunteerRepository.findOne(id);
      if (!volunteer) {
        throw new NotFoundException("ไม่พบผู้ใช้นี้ในระบบ");
      }
      volunteer.volunteerDepartments = volunteerDepartmentsDto.volunteerDepartments
        .map((volDepDto: VolunteerDepartmentDto) => ({
          volunteerId: volDepDto.volunteerId,
          departmentId: volDepDto.departmentId,
          trainingStatus: volDepDto.trainingStatus
        } as VolunteerDepartment));
      await this.volunteerRepository.save(volunteer);
    } catch (error) {
      throw error;
    }
  }

}
