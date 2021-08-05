import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [],
      useFactory: async () => ({
        endPoint: process.env.MINIO_ENDPOINT,
        port: parseInt(process.env.MINIO_PORT),
        useSSL: false, // If on localhost, keep it at false. If deployed on https, change to true
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
      }),
      inject: [],
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}