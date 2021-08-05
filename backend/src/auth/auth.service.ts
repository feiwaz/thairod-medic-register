import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      return {} as User;
    }
    return user;
  }

  // async tmpPwd() {
  //   const salt = await genSalt();
  //   console.log(salt);
  //   const password = hash("test", salt);
  //   console.log("pwd: "+password);
  //   return password;
  // }

  async verifyLogin(email: string, password: string): Promise<any> {
    console.log(email);
    // const user = await this.findByEmail(loginDto.email);
    // if (!user) {
    //   throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    // }
    // const password = await hash(loginDto.password, user.salt);
    // console.log(user.salt)
    // if (password !== user.password){
    //   throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    // }
    return null;
  }

  async login(user: any) {
    console.log('ttt')
    const payload = { username: user.username, sub: user.userId };
    console.log(payload)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
