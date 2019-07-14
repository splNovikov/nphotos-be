import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5050',
    methods: 'GET',
  });
  await app.listen(7777);
}

bootstrap();
