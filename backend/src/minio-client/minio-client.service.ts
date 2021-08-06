import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';

dotenv.config();

@Injectable()
export class MinioClientService {

  private readonly logger: Logger;
  private readonly baseBucket = process.env.MINIO_BUCKET_NAME

  public get client() {
    return this.minio.client;
  }

  constructor(
    private readonly minio: MinioService,
  ) {
    this.logger = new Logger('MinioStorageService');
  }

  public async upload(file: BufferedFile, folder: string, newName: string, baseBucket: string = this.baseBucket) {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('Error uploading file');
    }
    // const temp_filename = Date.now().toString()
    // const hashedFileName = crypto.createHash('md5').update(temp_filename).digest("hex");
    const fileExtension = file.mimetype.substring(6, file.mimetype.length);
    const fileName = `${folder}/${newName}.${fileExtension}`;
    const fileBuffer = file.buffer;
    this.client.putObject(baseBucket, fileName, fileBuffer, function (err, res) {
      if (err) throw new BadRequestException('Error uploading file');
    })

    return {
      url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`
    }
  }

  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    this.client.removeObject(baseBucket, objetName)
  }

}