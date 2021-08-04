import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RegistrationStatusDto } from 'src/users/dto/registration-status.dto';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { VolunteersService } from './volunteers.service';

@Controller('api/volunteers')
export class VolunteersController {

  constructor(private readonly service: VolunteersService) { }

  @Post()
  async create(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.service.create(createVolunteerDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':nationalId')
  findOne(@Param('nationalId') nationalId: number) {
    return this.service.findOne(nationalId);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':nationalId')
  remove(@Param('nationalId') nationalId: number) {
    return this.service.remove(nationalId);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id/training-status')
  findTrainingStatus(@Param('id') id: number) {
    return this.service.findTrainingStatus(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id/verify-registration-status')
  update(@Param('id') id: number, @Body() verifyStatusDto: RegistrationStatusDto) {
    return this.service.updateStatus(id, verifyStatusDto);
  }

}
