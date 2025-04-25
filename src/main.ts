import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Testing for Fullstack Developer YouApp')
    .setDescription('API with Swagger Documentation')
    .addBearerAuth({         // ← tambahkan ini
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    }, 'JWT-auth')
    .setVersion('1.0')
    .addTag('Auth') // Tambahkan ini!
    .addTag('Profile')
    .addTag('Chat') // Tambahkan ini!
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const rabbitUrl = process.env.RABBITMQ_URL;
  const rabbitQueue = process.env.RABBITMQ_QUEUE;

  if (!rabbitUrl || !rabbitQueue) {
    throw new Error('RabbitMQ configuration is missing in .env file');
  }

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: process.env.RABBITMQ_QUEUE!,
      queueOptions: { durable: false },
      exchange: 'chat_exchange',
      exchangeType: 'topic',
      // exchangeOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT || 3000);
  // console.log(`🚀 Application is running on: http://localhost:${process.env.PORT || 3000}`);
  // console.log(`📦 Swagger is available at: http://localhost:${process.env.PORT || 3000}/api`);
}
bootstrap();
