import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://nphotos.ru/',
    methods: 'GET',
  });
  await app.listen(80);
}

bootstrap();
