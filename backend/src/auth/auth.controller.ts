import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly service: AuthService) { }

  @Post('login')
  async create(@Body() loginDto: LoginDto) {
    return this.service.verifyLogin(loginDto);
  }
}
