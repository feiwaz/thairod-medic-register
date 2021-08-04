import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min
} from 'class-validator';
import { UserStatus } from 'src/users/entities/user.entity';
import { Department, DepartmentLabel } from '../entities/department.entity';
import { VolunteerInitial } from '../entities/volunteer.entity';

export class CreateVolunteerDto {

  @IsOptional()
  @Min(1000000000000, { message: 'id must be equal to 13 characters' })
  @Max(9999999999999, { message: 'id must be equal to 13 characters' })
  nationalId: string;

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
  @IsEnum(UserStatus, {
    message: `status must be like ${Object.values(UserStatus).join(', ')}`
  })
  status: UserStatus;

  //can insert with only id field
  @IsNotEmpty()
  @IsEnum(DepartmentLabel, {
    message: `department must be like ${Object.values(DepartmentLabel).join(', ')}`,
    each: true,
  })
  departments: Department[];

}
