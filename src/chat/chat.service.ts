import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @Inject('CHAT_SERVICE') private readonly client: ClientProxy,
  ) {}

  /** Publish ke RabbitMQ */
  async publishMessage(dto: SendMessageDto) {
    this.logger.log(`Publishing message to RMQ: ${JSON.stringify(dto)}`);
    this.client.emit('chat_message', dto);
    return { status: 'queued', ...dto };
  }

  /** Simpan ke MongoDB */
  async saveMessage(dto: SendMessageDto) {
    this.logger.log(`Saving message to MongoDB: ${JSON.stringify(dto)}`);
    const doc = new this.chatModel(dto);
    return doc.save();
  }

  /** Ambil histori chat antara dua user */
  async findChat(senderId: string, receiverId: string) {
    return this.chatModel
      .find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }
}
