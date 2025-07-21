import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // uploads as static
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Stripe
  app.use(
    '/payments/webhook',
    express.raw({ type: 'application/json' })
  );

  // Serve invoices as static
  app.use('/invoices', express.static(join(__dirname, '..', 'invoices')));

  app.use('/payments/webhook', bodyParser.raw({ type: 'application/json' }));

  // server at the end
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
