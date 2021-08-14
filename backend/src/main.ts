import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  if (process.env.ENABLED_APIDOC) {
    const config = new DocumentBuilder()
      .setTitle('Thairod API')
      .setDescription('Thairod API for diagnostic/testing')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('apidoc', app, document);
  }

  await app.listen(3000);
}
bootstrap();
