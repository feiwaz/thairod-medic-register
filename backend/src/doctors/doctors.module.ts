import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from './entities/doctor.entity';
import { SpecializedField } from './entities/specializedField.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, SpecializedField]),
    MinioClientModule
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule { }
