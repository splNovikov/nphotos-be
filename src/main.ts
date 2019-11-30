import { isDevelopment } from './utils/isDevelopment';

if (isDevelopment()) {
  // tslint:disable-next-line:no-var-requires
  require('dotenv').config();
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
