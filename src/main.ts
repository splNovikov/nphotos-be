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
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for',
  })
  // app.enableCors({
  //   origin: (origin, callback) => {
  //     if (allowedOrigins.includes(origin) || !origin) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Origin not allowed by CORS'));
  //     }
  //   },
  //   methods: isDev ? 'GET, PUT' : 'GET',
  // });
  await app.listen(process.env.PORT || 7777);
}

bootstrap();
