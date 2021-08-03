import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min
} from 'class-validator';
import { Department, DepartmentLabel } from '../entities/department.entity';
import {
  VolunteerInitial,
  VolunteerStatus
} from '../entities/volunteer.entity';

export class CreateVolunteerDto {

  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000000, { message: 'id must be equal to 13 characters' })
  @Max(9999999999999, { message: 'id must be equal to 13 characters' })
  id: string;

  @IsNotEmpty()
  @IsEnum(VolunteerInitial, {
    message: `initial must be like ${Object.values(VolunteerInitial).join(', ')}`
  })
  initial: VolunteerInitial;

  @IsNotEmpty()
  firstName: string;

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

  @IsOptional()
  @IsNumber()
  @Min(10000, { message: 'medCertificateId must be equal to 13 characters' })
  @Max(99999, { message: 'medCertificateId must be equal to 13 characters' })
  medCertificateId: number;

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
    message: `status must be like ${Object.values(VolunteerStatus).join(', ')}`
  })
  status: VolunteerStatus;

  //can insert with only id field
  @IsNotEmpty()
  @IsEnum(DepartmentLabel, {
    message: `department must be like ${Object.values(DepartmentLabel).join(', ')}`,
    each: true,
  })
  departments: Department[];

}
