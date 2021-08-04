import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { FileUploadService } from './file-upload.service';
import { BufferedFile } from 'src/minio-client/file.model';

@Controller('file-upload')
export class FileUploadController {
  constructor(
    private fileUploadService: FileUploadService
  ) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(
    @UploadedFile() image: BufferedFile
  ) {
    return await this.fileUploadService.uploadSingle(image)
  }
}