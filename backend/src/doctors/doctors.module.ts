import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationService } from 'src/base/registration.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { User } from 'src/users/entities/user.entity';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { DoctorVerification } from './entities/doctor-verification.entity';
import { Doctor } from './entities/doctor.entity';
import { SpecializedField } from './entities/specialized-field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, SpecializedField, User, DoctorVerification]),
    MinioClientModule
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService, RegistrationService],
})
export class DoctorsModule { }
