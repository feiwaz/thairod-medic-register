import { IsEnum, IsNotEmpty } from 'class-validator';
import { VolunteerStatus } from '../entities/volunteer.entity';

export class VerifyVolunteerDto {
  @IsNotEmpty()
  @IsEnum(VolunteerStatus, {
    message: 'status must be like ' + Object.values(VolunteerStatus).join(', '),
  })
  status: VolunteerStatus;
}
