import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { VerifyVolunteerDto } from './dto/verify-volunteer.dto';
import { VolunteersService } from './volunteers.service';

@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly service: VolunteersService) { }

  @Post()
  async create(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.service.create(createVolunteerDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

  @Patch(':id/verify-registration-status')
  update(@Param('id') id: number, @Body() verifyDoctor: VerifyVolunteerDto) {
    return this.service.updateStatus(id, verifyDoctor);
  }
}
