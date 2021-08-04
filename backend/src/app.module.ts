import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorsModule } from './doctors/doctors.module';
import { UsersModule } from './users/users.module';
import { VolunteersModule } from './volunteers/volunteers.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { FileUploadModule } from './file-upload/file-upload.module';

dotenv.config();
console.log(process.env);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    VolunteersModule,
    DoctorsModule,
    MinioClientModule,
    FileUploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
