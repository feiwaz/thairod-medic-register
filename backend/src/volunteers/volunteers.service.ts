import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BufferedFile } from 'src/minio-client/file.model';
import { RegistrationStatusDto } from 'src/users/dto/registration-status.dto';
import { In, Repository } from 'typeorm';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import {
  FindOneVolunteerDto
} from './dto/find-one-volunteer.dto';
import { TrainingStatusVolunteerDto } from './dto/training-status-volunteer.dto';
import { Department } from './entities/department.entity';
import { Volunteer } from './entities/volunteer.entity';
import { VolunteerDepartment } from './entities/volunteerDepartment.entity';

@Injectable()
export class VolunteersService {
  minioClientService: any;
  constructor(
    @InjectRepository(Volunteer)
    private volunteerRepository: Repository<Volunteer>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(VolunteerDepartment)
    private volunteerDepartmentRepository: Repository<VolunteerDepartment>,
  ) { }

  async create(createVolunteerDto: CreateVolunteerDto, imageFiles: BufferedFile) {
    try {
      const volunteer = await this.mapDtoToEntity(createVolunteerDto);
      const nId = createVolunteerDto.nationalId
      const suffix = "-vol"
      const idCardImg = imageFiles['id_card'][0]
      const idCardRes = await this.minioClientService.upload(idCardImg, nId + suffix, nId + "_ID_card")
      const idCardSelImg = imageFiles['id_card_sel'][0]
      const idCardSelRes = await this.minioClientService.upload(idCardSelImg, nId + suffix, nId + "_ID_card_selfie")
      const jobCerImg = imageFiles['job_cer'][0]
      const jobCerRes = await this.minioClientService.upload(jobCerImg, nId + suffix, nId + "_Job_cer")
      const jobCerSelImg = imageFiles['job_cer_sel'][0]
      const jobCerSelRes = await this.minioClientService.upload(jobCerSelImg, nId + suffix, nId + "_Job_cer_selfie")
      volunteer.idCardImg = idCardRes.url
      volunteer.idCardSelfieImg = idCardSelRes.url
      volunteer.jobCertificateImg = jobCerRes.url
      volunteer.jobCertificateSelfieImg = jobCerSelRes.url
      await this.volunteerRepository.save(volunteer);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw new InternalServerErrorException();
    }
  }

  private async mapDtoToEntity(createVolunteerDto: CreateVolunteerDto): Promise<Volunteer> {
    const { departments, ...volunteerEntities } = createVolunteerDto;
    const savedDepartments = await this.departmentRepository.find({
      where: { label: In(departments) },
    });
    const savedVolunteer = new Volunteer();
    savedVolunteer.nationalId = createVolunteerDto.nationalId;
    const volunteer = Object.assign(new Volunteer(), volunteerEntities);
    volunteer.volunteerDepartments = savedDepartments.map(department => ({
      departmentId: department.id
    } as VolunteerDepartment));
    return volunteer;
  }

  findAll(): Promise<Volunteer[]> {
    return this.volunteerRepository.find({
      relations: ['volunteerDepartments'],
      order: { updatedTime: 'DESC' }
    });
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
    if (!volunteerDepartmentList) {
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

  async updateStatus(id: number, verifyStatusDto: RegistrationStatusDto) {
    const response = await this.volunteerRepository.update(id, { status: verifyStatusDto.status });
    if (response['affected'] === 0) {
      throw new NotFoundException("ไม่พบผู้ใช้นี้ในระบบ");
    }
  }
}
