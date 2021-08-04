import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { UserInitial, UserStatus } from "../entities/user.entity";

export class CreateUserDto {

  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000000, { message: 'id must be equal to 13 characters' })
  @Max(9999999999999, { message: 'id must be equal to 13 characters' })
  id: string;

  @IsNotEmpty()
  @IsEnum(UserInitial, {
    message: `initial must be like ${Object.values(UserInitial).join(', ')}`
  })
  initial: UserInitial;

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
  @IsEnum(UserStatus, {
    message: `status must be like ${Object.values(UserStatus).join(', ')}`
  })
  status: UserStatus;

}
