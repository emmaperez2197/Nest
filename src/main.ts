import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  console.log(`Application running on the port ${await app.getUrl()}`);
}
bootstrap();
