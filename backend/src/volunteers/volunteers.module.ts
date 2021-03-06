import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationService } from 'src/base/registration.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { User } from 'src/users/entities/user.entity';
import { LineMessageService } from '../line-message/line-message.service';
import { TelemedService } from '../telemed/telemed.service';
import { Department } from './entities/department.entity';
import { VolunteerDepartment } from './entities/volunteer-department.entity';
import { VolunteerVerification } from './entities/volunteer-verification.entity';
import { Volunteer } from './entities/volunteer.entity';
import { VolunteersController } from './volunteers.controller';
import { VolunteersService } from './volunteers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Volunteer, Department, VolunteerDepartment, User, VolunteerVerification]),
    MinioClientModule,
    HttpModule
  ],
  controllers: [VolunteersController],
  providers: [VolunteersService, RegistrationService, TelemedService, LineMessageService],
})
export class VolunteersModule { }
