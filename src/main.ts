import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://www.nphotos.ru',
    methods: 'GET',
  });
  await app.listen(process.env.PORT || 7777);
}

bootstrap();
