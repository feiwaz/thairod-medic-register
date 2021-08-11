import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { VerificationStatus } from 'src/enum/verification-status.enum';
import { BufferedFile } from 'src/minio-client/file.model';
import { ParseFormDataRequestPipe } from 'src/pipes/parse-form-data-request.pipe';
import { VerificationDto } from 'src/users/dto/verification.dto';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { VolunteerDepartmentsDto } from './dto/volunteer-departments.dto';
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
    @UploadedFiles() bufferedFile: BufferedFile
  ) {
    return this.service.create(createVolunteerDto, bufferedFile);
  }

  @Get(':nationalId/register-info')
  getRegisterInfo(@Param('nationalId') nationalId: number) {
    return this.service.getRegisterInfo(nationalId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('approved')
  findAllApproved() {
    return this.service.findAllWithTrainingStatus(VerificationStatus.APPROVED);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Get(':nationalId/check-verification-status')
  checkStatus(@Param('nationalId') nationalId: number) {
    return this.service.checkStatus(nationalId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':nationalId')
  remove(@Param('nationalId') nationalId: number) {
    return this.service.remove(nationalId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/verify-registration-status')
  update(@Param('id') id: number, @Body(new ValidationPipe()) verificationDto: VerificationDto) {
    return this.service.updateStatus(+id, verificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/training-status')
  updateTrainingStatus(
    @Param('id') id: number,
    @Body(new ValidationPipe()) volunteerDepartmentsDto: VolunteerDepartmentsDto
  ) {
    return this.service.updateTrainingStatus(+id, volunteerDepartmentsDto);
  }

}
