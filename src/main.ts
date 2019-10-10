const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  require('dotenv/config');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let origin = ['http://www.nphotos.ru', 'https://n-photos.herokuapp.com'];
if (isDevelopment) {
  origin = [...origin, 'http://localhost:5050'];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin,
    methods: 'GET',
  });
  await app.listen(process.env.PORT || 7777);
}

bootstrap();
