import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorsService } from './doctors.service';
import { VerifyDoctorDto } from './dto/verify-doctor.dto';

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
  update(@Param('id') id: number, @Body() verifyDoctor: VerifyDoctorDto) {
    return this.service.updateStatus(id, verifyDoctor);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
