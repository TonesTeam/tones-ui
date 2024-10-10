import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const PORT = process.env.BE_PORT ?? 8080;

async function bootstrap() {
  const logger = new Logger("Boostrap");
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error(`Unhandled Reject at:`, promise, `reason:`, reason);
    // handle your exceptions here, you can log them, send them to a bug tracking system, etc.
  });

  process.on('uncaughtException', (exception: Error) => {
    console.error(`Uncaught Exception: `, exception);
    // handle your exceptions here, you can log them, send them to a bug tracking system, etc.
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api/v2');
  logger.log(`Listening on port ${PORT}`)
  await app.listen(PORT);
}
bootstrap();
