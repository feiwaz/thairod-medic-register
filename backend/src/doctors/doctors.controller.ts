import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorsService } from './doctors.service';
import { RegistrationStatusDto } from 'src/users/dto/registration-status.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly service: DoctorsService) { }

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.service.create(createDoctorDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id/verify-registration-status')
  update(@Param('id') id: number, @Body() verifyStatusDto: RegistrationStatusDto) {
    return this.service.updateStatus(id, verifyStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
