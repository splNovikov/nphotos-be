import { NestFactory } from '@nestjs/core';

import { isDevelopment } from './utils/isDevelopment';

const isDev = isDevelopment();

if (isDev) {
  // tslint:disable-next-line:no-var-requires
  require('dotenv').config();
}

import { AppModule } from './app.module';

const allowedOrigins = isDev
  ? '*'
  : ['http://www.nphotos.ru', 'https://n-photos.herokuapp.com'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: isDev ? 'GET, PUT' : 'GET',
  });
  await app.listen(process.env.PORT || 7777);
}

bootstrap();
