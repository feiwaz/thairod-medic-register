import {
  ConflictException,
  Injectable, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationService } from 'src/base/registration.service';
import { VerificationStatus } from 'src/enum/verification-status.enum';
import { BufferedFile } from 'src/minio-client/file.model';
import { VerificationDto } from 'src/users/dto/verification.dto';
import { User } from 'src/users/entities/user.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
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

  constructor(
    @InjectRepository(Volunteer)
    private volunteerRepository: Repository<Volunteer>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(VolunteerDepartment)
    private volunteerDepartmentRepository: Repository<VolunteerDepartment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VolunteerVerification)
    private volVerificationRepository: Repository<VolunteerVerification>,
    private registrationService: RegistrationService
  ) { }

  async create(createDto: CreateVolunteerDto, bufferedFile: BufferedFile) {
    try {
      await this.registrationService.validateUniqueFieldConstraints(this.volunteerRepository, createDto);
      const checkedEntity = await this.registrationService.checkIfNationalIdAlreadyExisted(this.volunteerRepository, createDto.nationalId);
      const entity = await this.mapDtoToEntity(createDto, checkedEntity as Volunteer);
      await this.registrationService.applyImageUrl(bufferedFile, entity, 'volunteers');
      await this.volunteerRepository.save(entity);
    } catch (error) {
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
    const volunteer = await this.volunteerRepository.findOne(id);
    if (!volunteer) {
      throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
    }
    return await this.mapEntityToDto(volunteer);
  }

  private async mapEntityToDto(volunteer: Volunteer): Promise<ResponseVolunteerDto> {
    const responseDto = Object.assign(new ResponseVolunteerDto(), volunteer);

    const volunteerDepartments = await this.volunteerDepartmentRepository.find({
      where: { volunteerId: volunteer.id },
      relations: ['department']
    });
    responseDto.departments = volunteerDepartments.map(volDep => volDep.department.label);
    await this.populateVerification(volunteer, responseDto);
    return responseDto;
  }

  async findOneFile(nationalId: number, filename: string): Promise<any> {
    const objectName = `volunteers/${nationalId}/${filename}`;
    return await this.registrationService.findOneFile(this.volunteerRepository, nationalId, objectName);
  }

  private async populateVerification(volunteer: Volunteer, responseDto: ResponseVolunteerDto) {
    const verification = await this.volVerificationRepository.findOne({
      where: { volunteer: { id: volunteer.id } },
      relations: ['verifiedBy'],
      order: { updatedTime: 'DESC' }
    });
    if (verification) {
      const { status, statusNote, updatedTime, verifiedBy } = verification;
      responseDto.verification = {
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
  }

  async checkStatus(nationalId: number): Promise<any> {
    return this.registrationService.checkStatus(nationalId, this.volunteerRepository,
      this.volVerificationRepository, 'volunteer');
  }

  async updateStatus(id: number, verificationDto: VerificationDto) {
    try {
      const volunteer = await this.volunteerRepository.findOne(id);
      if (!volunteer) {
        throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
      }
      const user = await this.userRepository.findOne(verificationDto.verifiedById);
      if (!user) {
        throw new NotFoundException('ไม่พบผู้ใช้นี้ในระบบ');
      }
      const volVerification = await this.findVerificationStatus(volunteer, user, verificationDto);
      this.volVerificationRepository.save(volVerification);
    } catch (error) {
      throw error;
    }
  }

  private async findVerificationStatus(volunteer: Volunteer, user: User, verificationDto: VerificationDto) {
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
    return volVerification;
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

  async remove(id: number): Promise<void> {
    await this.volunteerRepository.delete(id);
  }

}
