const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  require('dotenv/config');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: isDevelopment
      ? '*'
      : ['http://www.nphotos.ru', 'https://n-photos.herokuapp.com'],
    methods: 'GET',
  });
  await app.listen(process.env.PORT || 7777);
}

bootstrap();
