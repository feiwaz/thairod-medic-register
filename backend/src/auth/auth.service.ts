import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      return {} as User;
    }
    return user;
  }

  async verifyLogin(loginDto: LoginDto) {
    const user = await this.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
    }
    const password = await hash(loginDto.password, user.salt);
    if (password !== user.password){
      throw new UnauthorizedException("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
    }
  }
}
