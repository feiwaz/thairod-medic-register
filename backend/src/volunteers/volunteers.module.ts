import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { Department } from './entities/department.entity';
import { Volunteer } from './entities/volunteer.entity';
import { VolunteerDepartment } from './entities/volunteerDepartment.entity';
import { VolunteersController } from './volunteers.controller';
import { VolunteersService } from './volunteers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Volunteer, Department, VolunteerDepartment]),
    MinioClientModule
  ],
  controllers: [VolunteersController],
  providers: [VolunteersService],
})
export class VolunteersModule { }
