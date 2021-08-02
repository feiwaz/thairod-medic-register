import {
  ConflictException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
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
      const connection = getConnection();
      const saveVolunteer = new Volunteer();
      const saveObject = Object.assign(saveVolunteer, createVolunteerDto);
      saveObject.volunteerDepartment = [];
      createVolunteerDto.department.map((value): any => {
        const tempDepartment = new VolunteerDepartment();
        tempDepartment.departmentId = value.id;
        tempDepartment.volunteerId = createVolunteerDto.id + '';
        saveObject.volunteerDepartment.push(tempDepartment);
      });
      await connection.manager.save(saveObject);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw new InternalServerErrorException(error.code);
    }
  }

  findAll(): Promise<Volunteer[]> {
    return this.volunteerRepository.find({
      relations: ['volunteerDepartment'],
      order: {
        updatedTime: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Volunteer> {
    const volunteer = await this.volunteerRepository.findOne(id);
    if (!volunteer) {
      return {} as Volunteer;
    }
    return volunteer;
  }

  async remove(id: number): Promise<void> {
    await this.volunteerRepository.delete(id);
  }
}
