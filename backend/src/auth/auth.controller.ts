import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly service: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async create(@Request() req) {
    return this.service.login(req.user);
  }
}
