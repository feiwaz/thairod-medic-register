import {
  ConflictException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>
  ) { }

  async create(createDoctorDto: CreateDoctorDto) {
    try {
      await this.doctorsRepository.insert(createDoctorDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw new InternalServerErrorException(error.code);
    }
  }

  findAll(): Promise<Doctor[]> {
    return this.doctorsRepository.find({
      relations: ['specializedField'],
      order: {
        updatedTime: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Doctor> {
    const doctors = await this.doctorsRepository.findOne(id);
    if (!doctors) {
      return {} as Doctor;
    }
    return doctors;
  }

  async remove(id: number): Promise<void> {
    await this.doctorsRepository.delete(id);
  }
}
