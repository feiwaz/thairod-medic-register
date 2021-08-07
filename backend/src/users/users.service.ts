import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.mapCreateDtoToEntity(createUserDto);
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
      }
      throw error;
    }
  }

  private async mapCreateDtoToEntity(createUserDto: CreateUserDto): Promise<User> {
    const user: User = Object.assign(new User(), createUserDto);
    const createByUser = await this.userRepository.findOne(createUserDto.createdById);

    if (!createByUser) {
      throw new ConflictException('ไม่พบผู้ใช้นี้ในระบบ');
    }

    user.createdBy = createByUser;
    return user;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      return {} as User;
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.adminGuard(id);
      const savedUser = Object.assign(user, updateUserDto);
      await this.userRepository.save(savedUser);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const user = await this.adminGuard(id);
      if (user) {
        await this.userRepository.delete(id);
      }
    } catch (error) {
      throw error;
    }
  }

  async adminGuard(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne(id);
      if (user && user.email === 'admin@admin.com') {
        throw new ForbiddenException('You are not allowed to modify admin user');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    try {
      if (changePasswordDto.password !== changePasswordDto.confirmPassword) {
        throw new BadRequestException('New password and confirm password did not match');
      }
      const user = await this.userRepository.findOne(id, { select: ['password', 'email'] });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // TODO: guard admin
      if (user.email === 'admin@admin.com') {
        throw new ForbiddenException('You are not allowed to modify admin user');
      }
      const isMatched = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
      if (!isMatched) {
        throw new UnauthorizedException('Invalid credentials');
      }
      user.id = id;
      user.password = changePasswordDto.password;
      await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

}
