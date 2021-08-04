import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorsService } from './doctors.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly service: DoctorsService) { }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'id_card', maxCount: 1 },
    { name: 'id_card_sel', maxCount: 1 },
    { name: 'job_cer', maxCount: 1 },
    { name: 'job_cer_sel', maxCount: 1 }
  ]))
  async create(@Body() body: any, @UploadedFiles() images: BufferedFile
  ) {
    const doctorInfo = JSON.parse(body['body']) as CreateDoctorDto;
    return this.service.create(doctorInfo, images);
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
}
