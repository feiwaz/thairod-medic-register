import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParseFormDataRequestPipe } from 'src/pipes/parse-form-data-request.pipe';
import { RegistrationStatusDto } from 'src/users/dto/registration-status.dto';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { TrainingStatusVolunteerDto } from './dto/training-status-volunteer.dto';
import { VolunteersService } from './volunteers.service';

@Controller('volunteers')
export class VolunteersController {

  constructor(private readonly service: VolunteersService) { }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'idCard', maxCount: 1 },
    { name: 'idCardSelfie', maxCount: 1 },
    { name: 'medCertificate', maxCount: 1 },
    { name: 'medCertificateSelfie', maxCount: 1 }
  ]))
  async create(
    @Body(new ParseFormDataRequestPipe(), new ValidationPipe())
    createVolunteerDto: CreateVolunteerDto,
    @UploadedFiles() images: BufferedFile
  ) {
    return this.service.create(createVolunteerDto, images);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':nationalId')
  findOne(@Param('nationalId') nationalId: number) {
    return this.service.findOne(nationalId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':nationalId')
  remove(@Param('nationalId') nationalId: number) {
    return this.service.remove(nationalId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/training-status')
  findTrainingStatus(@Param('id') id: number) {
    return this.service.findTrainingStatus(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/training-status')
  updateTrainingStatus(@Param('id') id: number, @Body() trainingStatusVolunteerDto: TrainingStatusVolunteerDto) {
    return this.service.updateTrainingStatus(id, trainingStatusVolunteerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/verify-registration-status')
  update(@Param('id') id: number, @Body(new ValidationPipe()) verifyStatusDto: RegistrationStatusDto) {
    return this.service.updateStatus(id, verifyStatusDto);
  }

}
