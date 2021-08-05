import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  contactNumber: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'role must be admin or user' })
  role: UserRole;

  @IsNotEmpty()
  isActive: boolean;

  @IsNotEmpty()
  createdById: number;

}
