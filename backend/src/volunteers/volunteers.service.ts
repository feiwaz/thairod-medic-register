import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import {
  FindOneVolunteerDto,
  VolunteerToDepartment,
} from './dto/find-one-volunteer.dto';
import { VerifyVolunteerDto } from './dto/verify-volunteer.dto';
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
  ) {}

  async create(createVolunteerDto: CreateVolunteerDto) {
    try {
      const volunteer = await this.mapDtoToEntity(createVolunteerDto);
      await this.volunteerRepository.save(volunteer);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw new InternalServerErrorException(error.code);
    }
  }

  private async mapDtoToEntity(
    createVolunteerDto: CreateVolunteerDto,
  ): Promise<Volunteer> {
    const { department, ...volunteerEntities } = createVolunteerDto;
    const savedDepartment = await this.departmentRepository.find({
      where: { label: In(department) },
    });
    const volunteer = Object.assign(new Volunteer(), volunteerEntities);
    volunteer.volunteerDepartment = [];
    savedDepartment.map((department: Department) => {
      const tempVolunteerDepartment = new VolunteerDepartment();
      tempVolunteerDepartment.departmentId = department.id;
      tempVolunteerDepartment.volunteerId = createVolunteerDto.id + '';
      volunteer.volunteerDepartment.push(tempVolunteerDepartment);
    });
    return volunteer;
  }

  findAll(): Promise<Volunteer[]> {
    return this.volunteerRepository.find({
      relations: ['volunteerDepartment'],
      order: {
        updatedTime: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<FindOneVolunteerDto> {
    const volunteer = await this.volunteerRepository.findOne(id, {
      relations: ['volunteerDepartment'],
    });
    if (!volunteer) {
      return {} as FindOneVolunteerDto;
    }
    const response = await this.mapEntityToDto(volunteer);
    return response;
  }

  private async mapEntityToDto(
    volunteer: Volunteer,
  ): Promise<FindOneVolunteerDto> {
    const { volunteerDepartment, ...volunteerEntities } = volunteer;
    const responseDto = Object.assign(
      new FindOneVolunteerDto(),
      volunteerEntities,
    );
    responseDto.departments = [];

    const tempDepartment = await this.volunteerDepartmentRepository.find({
      where: { volunteerId: volunteerEntities.id },
      relations: ['department'],
    });

    volunteerDepartment.map((value: VolunteerDepartment) => {
      const temp = new VolunteerToDepartment();
      temp.label = tempDepartment.find(
        ({ departmentId }) => departmentId === value.departmentId,
      ).department.label;
      temp.isTrainingRequired = tempDepartment.find(
        ({ departmentId }) => departmentId === value.departmentId,
      ).department.isTrainingRequired;
      temp.trainingStatus = value.trainingStatus;
      responseDto.departments.push(temp);
    });

    return responseDto;
  }

  async remove(id: number): Promise<void> {
    await this.volunteerRepository.delete(id);
  }

  updateStatus(id: number, verifyVolunteer: VerifyVolunteerDto) {
    try {
      this.volunteerRepository.update(id, { status: verifyVolunteer.status });
    } catch (error) {
      throw new NotFoundException("ไม่พบ id นี้" + error.code);
    }
  }
}
