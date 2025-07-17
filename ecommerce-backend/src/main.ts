import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads'))); //express.sttaic is a built in middleware tht lets server  serve static files
  await app.listen(process.env.PORT ?? 3000);
  app.use(
  '/payments/webhook',
   express.raw({ type: 'application/json' }),
  );

}
bootstrap();
