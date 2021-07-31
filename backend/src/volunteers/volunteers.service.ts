import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { Volunteer } from './entities/volunteer.entity';
import { Department } from './entities/department.entity';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(Volunteer)
    private volunteersRepository: Repository<Volunteer>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createVolunteerDto: CreateVolunteerDto) {
    try {
      const connection = getConnection();
      const saveVolunteer = new Volunteer();
      const saveObject = Object.assign(saveVolunteer, createVolunteerDto);
      await connection.manager.save(saveObject);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw new InternalServerErrorException(error.code);
    }
  }

  findAll(): Promise<Volunteer[]> {
    return this.volunteersRepository.find({ relations: ['department'] });
  }

  async findOne(id: number): Promise<Volunteer> {
    const doctors = await this.volunteersRepository.findOne(id, {
      relations: ['department'],
    });
    if (!doctors) {
      return {} as Volunteer;
    }
    return doctors;
  }

  async remove(id: number): Promise<void> {
    await this.volunteersRepository.delete(id);
  }
}
