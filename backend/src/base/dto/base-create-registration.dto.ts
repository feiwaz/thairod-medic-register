import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { VerificationStatus } from 'src/enum/verification-status.enum';

export abstract class BaseCreateRegistrationDto {

  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000000, { message: 'nationalId must be equal to 13 characters' })
  @Max(9999999999999, { message: 'nationalId must be equal to 13 characters' })
  nationalId: string;

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
  @IsEnum(VerificationStatus, {
    message: `status must be like ${Object.values(VerificationStatus).join(', ')}`
  })
  status: VerificationStatus;

  @IsNotEmpty()
  @IsString()
  availableTimes: string;

}
