import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { VerificationStatus } from 'src/enum/verification-status.enum';

export class VerificationDto {

  @IsNotEmpty()
  @IsEnum(VerificationStatus, {
    message: 'status must be like ' + Object.values(VerificationStatus).join(', '),
  })
  status: VerificationStatus;

  @IsNotEmpty()
  verifiedById: number

  @IsOptional()
  statusNote: string;

}
