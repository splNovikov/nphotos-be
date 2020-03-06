import { isDevelopment } from './utils/isDevelopment';

const isDev = isDevelopment();

if (isDev) {
  // tslint:disable-next-line:no-var-requires
  require('dotenv').config();
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const allowedOrigins = ['http://www.nphotos.ru', 'https://n-photos.herokuapp.com'];
const corsOptions = isDev
  ? // development
    {
      origin: '*',
      methods: 'GET, PUT',
    }
  : // production:
    { origin: allowedOrigins, methods: 'GET' };

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 7777);
}

bootstrap();
