import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // 정적 파일 제공
  console.log(__dirname);
  // react build 한 파일 있는 위치
  app.use('/assets', express.static(path.join(process.cwd(),'..', 'stackoverflow-front', 'dist', 'assets')))
  // svg사진 있는 위치
  app.use('/svg', express.static(path.join(process.cwd(), '..', 'stackoverflow-front', 'svg')))
  // 사진 요청 시
  app.use('/static', express.static(path.join(process.cwd(), 'assets')));
  app.use(
    `/avatars`,
    express.static(path.join(__dirname, 'assets', 'images', 'avatars')),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
