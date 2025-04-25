// src/chat/chat.consumer.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller()
export class ChatConsumer {
  constructor(private readonly chatService: ChatService) {}

  @EventPattern('chat_message')
  async handleMessage(@Payload() data: SendMessageDto) {
    console.log('[Consumer] got', data);
    await this.chatService.saveMessage(data);
  }
}
