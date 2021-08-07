import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ email: username }, {
      select: ['id', 'email', 'password', 'firstName', 'lastName', 'contactNumber', 'role', 'isActive']
    });
    if (user && await bcrypt.compare(password, user.password) && user.isActive) {
      const { id, email, firstName, lastName, contactNumber, role, isActive } = user;
      return { id, email, firstName, lastName, contactNumber, role, isActive } as User;
    }
    return null;
  }

  async login(user: User) {
    const payload = { user: JSON.stringify(user) };
    return {
      accessToken: this.jwtService.sign(payload)
    };
  }
}
