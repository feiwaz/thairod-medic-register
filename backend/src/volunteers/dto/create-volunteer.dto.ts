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
  VolunteerInitial,
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
  @IsEnum(VolunteerInitial, {
    message: 'initial must be like นาย, นางสาว, นาง, เด็กชาย, เด็กหญิง',
  })
  initial: VolunteerInitial;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  contactNumber: string;

  @IsNotEmpty()
  lineId: string;

  @IsNotEmpty()
  medCertificateId: string;

  // @IsNotEmpty() TODO: Will bring back later
  jobCertificateImg: string;

  // @IsNotEmpty() TODO: Will bring back later
  jobCertificateSelfieImg: string;

  // @IsNotEmpty() TODO: Will bring back later
  idCardImg: string;

  // @IsNotEmpty() TODO: Will bring back later
  idCardSelfieImg: string;

  @IsOptional()
  @IsEnum(VolunteerStatus, {
    message: 'status must be like รอการอนุมัติ, อนุมัติแล้ว',
  })
  status: VolunteerStatus;

  //can insert with only id field
  @IsOptional()
  department: Department[];

}
