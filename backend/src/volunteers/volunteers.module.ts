import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { Department } from './entities/department.entity';
import { VolunteerDepartment } from './entities/volunteerDepartment.entity';
import { VolunteersController } from './volunteers.controller';
import { VolunteersService } from './volunteers.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Volunteer, Department, VolunteerDepartment]),
  ],
  controllers: [VolunteersController],
  providers: [VolunteersService],
})
export class VolunteersModule {}
