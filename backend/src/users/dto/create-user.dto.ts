import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {

  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000000, { message: 'id must be equal to 13 characters' })
  @Max(9999999999999, { message: 'id must be equal to 13 characters' })
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  salt: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  contactNumber: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'role must be Admin or User'})

  @IsNotEmpty()
  isActive: boolean;

  @IsNotEmpty()
  createdBy: string;

}
