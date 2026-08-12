import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createDocument } from './config/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  createDocument(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 8000);
  console.log('app is lisning on port', process.env.PORT);
}
bootstrap();
