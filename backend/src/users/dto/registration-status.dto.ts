import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../entities/user.entity';

export class RegistrationStatusDto {
  @IsNotEmpty()
  @IsEnum(UserStatus, {
    message: 'status must be like ' + Object.values(UserStatus).join(', '),
  })
  status: UserStatus;
}
