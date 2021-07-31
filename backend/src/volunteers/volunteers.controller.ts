import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { VolunteersService } from './volunteers.service';

@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Post()
  async create(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.volunteersService.create(createVolunteerDto);
  }

  @Get()
  findAll() {
    return this.volunteersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.volunteersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.volunteersService.remove(id);
  }
}
