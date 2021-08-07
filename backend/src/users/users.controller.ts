import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {

  constructor(private readonly service: UsersService) { }

  @Post()
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto
  ) {
    return this.service.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

  @Put(':id/change-password')
  changePassword(
    @Param('id') id: number,
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto
  ) {
    return this.service.changePassword(+id, changePasswordDto);
  }

}
