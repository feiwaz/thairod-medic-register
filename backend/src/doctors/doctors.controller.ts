import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.doctorsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.doctorsService.remove(id);
  }
}
