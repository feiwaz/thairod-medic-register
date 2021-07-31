import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Expertise } from './entities/expertise.entity';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Expertise])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
