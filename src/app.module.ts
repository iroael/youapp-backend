import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'; // kalau ada AuthModule
import { ChatModule } from './chat/chat.module'; // kalau ada ChatModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configure Mongoose connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error('MONGO_URI not defined in .env');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),

    // Configure RabbitMQ client
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [cs.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: cs.get<string>('RABBITMQ_QUEUE') || 'chat_queue',
            queueOptions: { durable: false },
          },
        }),
      },
    ]),

    // application module
    UserModule,
    ChatModule, // uncomment if you have a ChatModule
    AuthModule, // jangan lupa masukkan jika kamu pakai auth
  ],
})
export class AppModule {}
