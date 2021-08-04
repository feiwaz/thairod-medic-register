import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { DoctorInitial, DoctorStatus } from '../entities/doctor.entity';
import { SpecializedFieldLabel } from '../entities/specializedField.entity';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000000, { message: 'id must be equal to 13 characters' })
  @Max(9999999999999, { message: 'id must be equal to 13 characters' })
  id: string;

  @IsNotEmpty()
  @IsEnum(DoctorInitial, {
    message: `initial must be like ${Object.values(DoctorInitial).join(', ')}`
  })
  initial: DoctorInitial;

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

  @IsNotEmpty()
  @IsNumber()
  @Min(10000, {
    message: 'medCertificateId must be equal to 5 characters'
  })
  @Max(99999, {
    message: 'medCertificateId must be equal to 5 characters'
  })
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
  @IsEnum(DoctorStatus, {
    message: `status must be like ${Object.values(DoctorStatus).join(', ')}`
  })
  status: DoctorStatus;

  @IsNotEmpty()
  @IsEnum(SpecializedFieldLabel, {
    message: `specializedFields must be like ${Object.values(SpecializedFieldLabel).join(', ')}`,
    each: true
  })
  specializedFields: SpecializedFieldLabel[];

}
