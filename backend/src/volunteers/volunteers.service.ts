import {
  ConflictException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import {
  FindOneVolunteerDto
} from './dto/find-one-volunteer.dto';
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
  ) { }

  async create(createVolunteerDto: CreateVolunteerDto) {
    try {
      const volunteer = await this.mapDtoToEntity(createVolunteerDto);
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
    const volunteer = Object.assign(new Volunteer(), volunteerEntities);
    volunteer.volunteerDepartments = savedDepartments.map(department => ({
      departmentId: department.id,
      volunteerId: createVolunteerDto.id + ''
    } as VolunteerDepartment));
    return volunteer;
  }

  findAll(): Promise<Volunteer[]> {
    return this.volunteerRepository.find({
      relations: ['volunteerDepartments'],
      order: { updatedTime: 'DESC' }
    });
  }

  async findOne(id: number): Promise<FindOneVolunteerDto> {
    const volunteer = await this.volunteerRepository.findOne(id, {
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
}
