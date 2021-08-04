import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEmail, IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from "../entities/user.entity";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsEnum(UserRole, { message: 'role must be Admin or User'})
    role: UserRole;
}
