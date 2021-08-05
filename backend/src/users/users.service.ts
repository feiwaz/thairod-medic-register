import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      const user = await this.userRepository.findOne(id);
      const savedUser = Object.assign(user, updateUserDto);
      await this.userRepository.save(savedUser);
    } catch (error) {
      throw new InternalServerErrorException(error.code);
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

}
