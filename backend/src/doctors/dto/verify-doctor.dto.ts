import { IsEnum, IsNotEmpty } from 'class-validator';
import { DoctorStatus } from '../entities/doctor.entity';

export class VerifyDoctorDto {
  @IsNotEmpty()
  @IsEnum(DoctorStatus, {
    message: 'status must be like ' + Object.values(DoctorStatus).join(', '),
  })
  status: DoctorStatus;
}
