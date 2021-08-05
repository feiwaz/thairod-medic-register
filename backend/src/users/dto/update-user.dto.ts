import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from "../entities/user.entity";
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsEnum(UserRole, { message: 'role must be admin or user' })
    role: UserRole;

}
