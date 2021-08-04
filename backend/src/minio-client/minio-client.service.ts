import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { Stream } from 'stream';
import * as dotenv from 'dotenv';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto'

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

  public async upload(file: BufferedFile, baseBucket: string = this.baseBucket) {
    if(!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
    }
    const temp_filename = Date.now().toString()
    const hashedFileName = crypto.createHash('md5').update(temp_filename).digest("hex");
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    const filename = hashedFileName + ext
    const fileName = `${filename}`;
    const fileBuffer = file.buffer;
    console.log(baseBucket)
    console.log(fileName)
    console.log(this.client)
    this.client.putObject(baseBucket,fileName,fileBuffer, function(err, res) {
      if(err) throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
    })

    return {
      url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${filename}`
    }
  }

  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    this.client.removeObject(baseBucket, objetName)
  }
}