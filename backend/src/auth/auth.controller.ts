import { Body, Controller, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly service: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.service.login(req.user);
  }

  @Post('refresh-token')
  async refreshToken(@Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto) {
    return this.service.refreshToken(refreshTokenDto);
  }

}
