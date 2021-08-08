import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { RegistrationStatusDto } from 'src/users/dto/registration-status.dto';
import { In, Repository } from 'typeorm';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import {
  FindOneVolunteerDto
} from './dto/find-one-volunteer.dto';
import { TrainingStatusVolunteerDto } from './dto/training-status-volunteer.dto';
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
      resultObject = await this.minioClientService.uploadBufferedFile(createDto.nationalId, bufferedFile);
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

  findAll(): Promise<Volunteer[]> {
    const volunteers = this.volunteerRepository.find({
      relations: ['volunteerDepartments', 'volunteerDepartments.department'],
      order: { updatedTime: 'DESC' }
    });
    return volunteers;
  }

  async findOne(nationalId: number): Promise<FindOneVolunteerDto> {
    const volunteer = await this.volunteerRepository.findOne({
      where: { nationalId },
      relations: ['volunteerDepartments']
    });
    if (!volunteer) {
      return {} as FindOneVolunteerDto;
    }
    return await this.mapEntityToDto(volunteer);
  }

  private async mapEntityToDto(volunteer: Volunteer): Promise<FindOneVolunteerDto> {
    const { volunteerDepartments, ...volunteerEntities } = volunteer;
    const responseDto = Object.assign(new FindOneVolunteerDto(), volunteerEntities);
    const tempDepartment = await this.volunteerDepartmentRepository.find({
      where: { volunteerId: volunteerEntities.id },
      relations: ['department'],
    });

    responseDto.departments = volunteerDepartments.map(volunteerDepartment => {
      const matchedDepartment = tempDepartment.find(({ departmentId }) => departmentId === volunteerDepartment.departmentId).department;
      return {
        label: matchedDepartment.label,
        isTrainingRequired: matchedDepartment.isTrainingRequired,
        trainingStatus: volunteerDepartment.trainingStatus
      }
    });

    return responseDto;
  }

  async remove(id: number): Promise<void> {
    await this.volunteerRepository.delete(id);
  }

  async findTrainingStatus(id: number): Promise<TrainingStatusVolunteerDto> {
    const volunteerDepartmentList = await this.volunteerDepartmentRepository.find({
      where: { volunteerId: id },
      relations: ['department'],
    });
    if (volunteerDepartmentList.length === 0) {
      return {} as TrainingStatusVolunteerDto;
    }
    return this.mapEntityToTrainingStatusVolunteerDto(volunteerDepartmentList);
  }

  private mapEntityToTrainingStatusVolunteerDto(volunteerDepartmentList: VolunteerDepartment[]): Promise<TrainingStatusVolunteerDto> {
    const trainingStatusDto = Object.assign(new TrainingStatusVolunteerDto());
    trainingStatusDto.id = null;
    trainingStatusDto.passedDepartment = [];
    trainingStatusDto.failedDepartment = [];

    for (const volunteerDepmt of volunteerDepartmentList) {
      const { department, ...volunteerDepartment } = volunteerDepmt;
      if (trainingStatusDto.id == null) { trainingStatusDto.id = volunteerDepartment.volunteerId; }

      if (volunteerDepartment.trainingStatus == 1) {
        trainingStatusDto.passedDepartment.push(department);
      } else if (volunteerDepartment.trainingStatus == 0) {
        trainingStatusDto.failedDepartment.push(department);
      }
    }
    return trainingStatusDto;
  }

  async patchTrainingStatus(id: number, trainingStatusDto: TrainingStatusVolunteerDto) {
    try {
      const volunteerDepartmentUpdateList = await this.mapTrainingStatusDtoToEntity(id, trainingStatusDto);
      await this.volunteerDepartmentRepository.save(volunteerDepartmentUpdateList);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private async mapTrainingStatusDtoToEntity(id: number, trainingStatusDto: TrainingStatusVolunteerDto): Promise<VolunteerDepartment[]> {
    const VolunteerDepartmentList = [];
    let tempVolunteerDepartment = null;

    for (const passedDepartment of trainingStatusDto.passedDepartment) {
      tempVolunteerDepartment = Object.assign(new VolunteerDepartment());
      tempVolunteerDepartment.volunteerId = id;
      tempVolunteerDepartment.departmentId = passedDepartment.id;
      tempVolunteerDepartment.trainingStatus = 1;
      VolunteerDepartmentList.push(tempVolunteerDepartment)
    }
    for (const failedDepartment of trainingStatusDto.failedDepartment) {
      tempVolunteerDepartment = Object.assign(new VolunteerDepartment());
      tempVolunteerDepartment.volunteerId = id;
      tempVolunteerDepartment.departmentId = failedDepartment.id;
      tempVolunteerDepartment.trainingStatus = 0;
      VolunteerDepartmentList.push(tempVolunteerDepartment)
    }

    return VolunteerDepartmentList;
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
      const volunteerDepartments = volunteerDepartmentsDto.volunteerDepartments
        .map((volDepDto: VolunteerDepartmentDto) => ({
          volunteerId: volDepDto.volunteerId,
          departmentId: volDepDto.departmentId,
          trainingStatus: volDepDto.trainingStatus
        } as VolunteerDepartment));
      volunteer.volunteerDepartments = volunteerDepartments;
      await this.volunteerRepository.save(volunteer);
    } catch (error) {
      throw error;
    }
  }

}
