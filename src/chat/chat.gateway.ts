import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  /** Jika ingin handle langsung dari WebSocket client */
  @SubscribeMessage('send_message')
  async onClientMessage(@MessageBody() dto: SendMessageDto) {
    // Publish ke RabbitMQ (langsung memicu consumer)
    await this.chatService.publishMessage(dto);
    return { status: 'queued' };
  }
}
