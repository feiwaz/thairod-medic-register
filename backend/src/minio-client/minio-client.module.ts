import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { MinioClientService } from './minio-client.service';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [],
      useFactory: async () => ({
        endPoint: process.env.MINIO_ENDPOINT,
        port: parseInt(process.env.MINIO_PORT),
        useSSL: process.env.MINIO_SSL == 'false' ? false : true,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
      }),
      inject: [],
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule { }