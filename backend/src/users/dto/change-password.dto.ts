import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {

  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'password must be at least 8 characters'
  })
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

}
