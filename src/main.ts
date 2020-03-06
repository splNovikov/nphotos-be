import { NestFactory } from '@nestjs/core';

import { isDevelopment } from './utils/isDevelopment';

const isDev = isDevelopment();

if (isDev) {
  // tslint:disable-next-line:no-var-requires
  require('dotenv').config();
}

import { AppModule } from './app.module';

const corsOptions = {
  origin: isDev
    ? '*'
    : ['http://www.nphotos.ru', 'https://n-photos.herokuapp.com'],
  methods: isDev ? 'GET, PUT' : 'GET',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  await app.listen(process.env.PORT || 7777);
}

bootstrap();
