import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BufferedFile } from 'src/minio-client/file.model';
import { ParseFormDataRequestPipe } from 'src/pipes/parse-form-data-request.pipe';
import { VerificationDto } from 'src/users/dto/verification.dto';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Controller('doctors')
export class DoctorsController {

  constructor(private readonly service: DoctorsService) { }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'idCard', maxCount: 1 },
    { name: 'idCardSelfie', maxCount: 1 },
    { name: 'medCertificate', maxCount: 1 },
    { name: 'medCertificateSelfie', maxCount: 1 }
  ]))
  async create(
    @Body(new ParseFormDataRequestPipe(), new ValidationPipe())
    createDoctorDto: CreateDoctorDto,
    @UploadedFiles() bufferedFile: BufferedFile
  ) {
    return this.service.create(createDoctorDto, bufferedFile);
  }

  @Get(':nationalId/register-info')
  getRegisterInfo(@Param('nationalId') nationalId: number) {
    return this.service.getRegisterInfo(nationalId);
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

  @UseGuards(JwtAuthGuard)
  @Get(':nationalId/files/:filename')
  async findOneFile(
    @Param('nationalId') nationalId: number,
    @Param('filename') filename: string,
    @Res() response: Response
  ) {
    const stream = await this.service.findOneFile(nationalId, filename);
    response.set({ 'Content-Type': stream.headers['content-type'] });
    stream.pipe(response);
    return response;
  }

  @Get(':nationalId/check-verification-status')
  checkStatus(@Param('nationalId') nationalId: number) {
    return this.service.checkStatus(nationalId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/verify-registration-status')
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) verifyStatusDto: VerificationDto
  ) {
    return this.service.updateStatus(+id, verifyStatusDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

}
