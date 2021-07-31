import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { DoctorPrename, DoctorStatus } from '../entities/doctor.entity';
import { Expertise } from '../entities/expertise.entity';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000000, { message: 'id must be equal to 13 characters' })
  @Max(9999999999999, { message: 'id must be equal to 13 characters' })
  id: string;

  @IsNotEmpty()
  @IsEnum(DoctorPrename, {
    message:
      'prename must be like แพทย์หญิง, นายแพทย์, เภสัชกรชาย, เภสัชกรหญิง',
  })
  preName: DoctorPrename;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surName: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  tel: string;

  @IsNotEmpty()
  lineId: string;

  @IsNotEmpty()
  medicalId: string;

  @IsNotEmpty()
  jobCertificateImg: string;

  @IsNotEmpty()
  jobCertificateSelfieImg: string;

  @IsNotEmpty()
  nationalCardImg: string;

  @IsNotEmpty()
  nationalCardSelfieImg: string;

  @IsOptional()
  @IsEnum(DoctorStatus, {
    message: 'status must be like รอการอนุมัติ, อนุมัติแล้ว',
  })
  status: DoctorStatus;

  //can insert with only id field
  @IsOptional()
  expertise: Expertise[];
}
