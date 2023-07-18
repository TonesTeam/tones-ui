import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api/v2")
  const port = process.env.BE_PORT ?? 8080
  await app.listen(port);
}
bootstrap();
