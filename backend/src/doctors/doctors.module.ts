import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { SpecializedField } from './entities/specializedField.entity';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, SpecializedField])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule { }
