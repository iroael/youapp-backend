// src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatConsumer } from './chat.consumer';
import { ChatGateway } from './chat.gateway';
import { Chat, ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: process.env.RABBITMQ_QUEUE!,
          queueOptions: { durable: false },
          exchange: 'chat_exchange',
          exchangeType: 'topic',
          // exchangeOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [ChatController, ChatConsumer], // ← ChatConsumer di‐load sebagai controller microservice
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
