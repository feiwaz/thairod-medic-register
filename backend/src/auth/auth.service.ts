import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
    const secret = process.env.SECRET_REFRESH_TOKEN as string;
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { secret, expiresIn: '1y' })
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    let payload = null;
    const secret = process.env.SECRET_REFRESH_TOKEN as string;

    try {
      const { refreshToken } = refreshTokenDto;
      const decodedToken = this.jwtService.verify(refreshToken, { secret });
      const tokenUserId = JSON.parse(decodedToken.user).id;
      const user = await this.userRepository.findOne({ id: tokenUserId });
      if (!user) {
        throw new NotFoundException();
      }
      payload = { user: JSON.stringify(user) };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException();
      }
      throw error;
    }

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { secret, expiresIn: '1y' })
    };
  }

}
