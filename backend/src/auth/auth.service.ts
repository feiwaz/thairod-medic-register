import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: 'aaa@aaa.com' });
    return user;
  }

  async verifyLogin(username: string, password: string): Promise<any> {
    const user = await this.findByEmail(username);
    if (!user) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
    const pwd = await hash(password, user.salt);
    if (pwd !== user.password){
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
    return user;
  }

  async login(user: any) {
    console.log(user);
    const payload = { user: user.toJSON() };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
