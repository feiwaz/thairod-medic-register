import {
  ConflictException,
  Injectable, Logger, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationService } from 'src/base/registration.service';
import { VerificationStatus } from 'src/enum/verification-status.enum';
import { BufferedFile } from 'src/minio-client/file.model';
import { VerificationDto } from 'src/users/dto/verification.dto';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { ResponseDepartmentDto } from './dto/response-department.dto';
import {
  ResponseVolunteerDto
} from './dto/response-volunteer.dto';
import { VolunteerDepartmentDto } from './dto/volunteer-department.dto';
import { VolunteerDepartmentsDto } from './dto/volunteer-departments.dto';
import { Department } from './entities/department.entity';
import { VolunteerDepartment } from './entities/volunteer-department.entity';
import { VolunteerVerification } from './entities/volunteer-verification.entity';
import { Volunteer } from './entities/volunteer.entity';

@Injectable()
export class VolunteersService {

  private readonly logger = new Logger(VolunteersService.name);

  constructor(
    @InjectRepository(Volunteer)
    private volunteerRepository: Repository<Volunteer>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VolunteerVerification)
    private volVerificationRepository: Repository<VolunteerVerification>,
    private registrationService: RegistrationService
  ) { }

  async create(createDto: CreateVolunteerDto, bufferedFile: BufferedFile) {
    try {
      const validatedEntity = await this.registrationService.validateUniqueFieldConstraints(this.volunteerRepository, createDto);
      const entity = await this.mapDtoToEntity(createDto, validatedEntity as Volunteer);
      await this.registrationService.applyImageUrl(bufferedFile, entity, 'volunteers');
      const volunteer = await this.volunteerRepository.save(entity);
      this.logger.log(`Volunteer ID: ${volunteer.id} has been updated`);
    } catch (error) {
      this.logger.error(`Failed to execute #create with error: ${error}`);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw error;
    }
  }

  private async mapDtoToEntity(createDto: CreateVolunteerDto, volunteer: Volunteer): Promise<Volunteer> {
    const { departments, ...restCreateDto } = createDto;
    const savedDepartments = await this.departmentRepository.find({
      where: { label: In(departments) }
    });
    const entity = Object.assign(volunteer, restCreateDto);
    entity.volunteerDepartments = savedDepartments.map(department => ({
      departmentId: department.id
    } as VolunteerDepartment)) || [];
    return entity;
  }

  async getRegisterInfo(nationalId: number): Promise<any> {
    return this.registrationService.getRegisterInfo(nationalId, this.volunteerRepository);
  }

  findAll(): Promise<Volunteer[]> {
    return this.registrationService.findAll(this.volunteerRepository);
  }

  findAllWithTrainingStatus(status?: VerificationStatus): Promise<Volunteer[]> {
    const options: FindManyOptions<Volunteer> = {
      select: ['id', 'initial', 'firstName', 'lastName', 'status', 'volunteerDepartments'],
      relations: ['volunteerDepartments', 'volunteerDepartments.department'],
      order: { updatedTime: 'DESC' }
    };

    if (status) {
      options.where = { status };
    }
    return this.volunteerRepository.find(options);
  }

  async findOne(id: number): Promise<ResponseVolunteerDto> {
    const volunteer = await this.volunteerRepository.findOne(id, {
      relations: ['volunteerDepartments', 'volunteerDepartments.department']
    });
    if (!volunteer) {
      throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
    }
    return await this.mapEntityToDto(volunteer);
  }

  private async mapEntityToDto(volunteer: Volunteer): Promise<ResponseVolunteerDto> {
    const { volunteerDepartments, ...restEntities } = volunteer;
    const responseDto = Object.assign(new ResponseVolunteerDto(), restEntities);
    responseDto.departments = volunteerDepartments.map(volDep => ({
      label: volDep.department.label,
      trainingStatus: volDep.trainingStatus,
      isTrainingRequired: volDep.department.isTrainingRequired
    } as ResponseDepartmentDto));
    responseDto.verification = await this.registrationService.populateVerification(volunteer, 'volunteers', this.volVerificationRepository);
    return responseDto;
  }

  async findOneFile(nationalId: number, filename: string): Promise<any> {
    const objectName = `volunteers/${nationalId}/${filename}`;
    return await this.registrationService.findOneFile(this.volunteerRepository, nationalId, objectName);
  }

  async checkStatus(nationalId: number): Promise<any> {
    return this.registrationService.checkStatus(nationalId, this.volunteerRepository,
      this.volVerificationRepository, 'volunteer');
  }

  async updateStatus(id: number, verificationDto: VerificationDto) {
    try {
      const volunteer = await this.volunteerRepository.findOne(id, {
        relations: ['volunteerDepartments', 'volunteerDepartments.department']
      });
      if (!volunteer) {
        throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
      }
      const user = await this.userRepository.findOne(verificationDto.verifiedById);
      if (!user) {
        throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
      }
      const volVerification = await this.findVerificationStatus(volunteer, user, verificationDto);
      await this.registrationService.sendDataToTelemed(volVerification, 'volunteers');
      volVerification.volunteer.volunteerDepartments.forEach(volDep => delete volDep.department);
      await this.volVerificationRepository.save(volVerification);
      this.logger.log(`Verification status of volunteer ID: ${id} has been updated to ${volVerification.volunteer.status}`);
    } catch (error) {
      this.logger.error(`Failed to execute #updateStatus with error: ${error}`);
      throw error;
    }
  }

  private async findVerificationStatus(volunteer: Volunteer, user: User, verificationDto: VerificationDto): Promise<VolunteerVerification> {
    let volVerification = await this.volVerificationRepository.findOne({
      where: { volunteer: { id: volunteer.id }, verifiedBy: { id: user.id } },
      relations: ['volunteer', 'verifiedBy']
    });
    if (!volVerification) {
      volVerification = new VolunteerVerification();
      volVerification.volunteer = volunteer;
      volVerification.verifiedBy = user;
    }
    volVerification.volunteer.status = verificationDto.status;
    volVerification.status = verificationDto.status;
    volVerification.statusNote = verificationDto.statusNote;
    volVerification.updatedTime = new Date();
    return volVerification;
  }

  async updateTrainingStatus(id: number, volunteerDepartmentsDto: VolunteerDepartmentsDto) {
    try {
      const volunteer = await this.volunteerRepository.findOne(id);
      if (!volunteer) {
        throw new NotFoundException("ไม่พบผู้ใช้นี้ในระบบ");
      }
      volunteer.volunteerDepartments = volunteerDepartmentsDto.volunteerDepartments
        .map((volDepDto: VolunteerDepartmentDto) => ({ ...volDepDto } as VolunteerDepartment));
      await this.volunteerRepository.save(volunteer);
      this.logger.log(`Training status of volunteer ID: ${id} has been updated`);
    } catch (error) {
      this.logger.error(`Failed to execute #updateTrainingStatus with error: ${error}`);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.volunteerRepository.delete(id);
  }

}
