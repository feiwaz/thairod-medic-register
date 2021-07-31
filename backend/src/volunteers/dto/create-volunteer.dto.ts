import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import {
  VolunteerPrename,
  VolunteerStatus,
} from '../entities/volunteer.entity';
import { Department } from '../entities/department.entity';

export class CreateVolunteerDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000000, { message: 'id must be equal to 13 characters' })
  @Max(9999999999999, { message: 'id must be equal to 13 characters' })
  id: string;

  @IsNotEmpty()
  @IsEnum(VolunteerPrename, {
    message: 'initial must be like นาย, นางสาว, นาง, เด็กชาย, เด็กหญิง',
  })
  preName: VolunteerPrename;

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
  @IsEnum(VolunteerStatus, {
    message: 'status must be like รอการอนุมัติ, อนุมัติแล้ว',
  })
  status: VolunteerStatus;

  //can insert with only id field
  @IsOptional()
  departments: Department[];
}
