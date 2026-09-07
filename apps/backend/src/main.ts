import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createDocument } from './config/swagger/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrifix = 'api/v1';
  app.use(cookieParser());
  app.setGlobalPrefix(globalPrifix);
  createDocument(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 8000);
  console.log('app is lisning on port', process.env.PORT);
}
bootstrap();
