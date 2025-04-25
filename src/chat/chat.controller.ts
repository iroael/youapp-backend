import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Send a chat message' })
  sendMessage(@Body() dto: SendMessageDto) {
    return this.chatService.publishMessage(dto);
  }

  @Get(':user1/:user2')
  @ApiOperation({ summary: 'Get chat history between two users' })
  getHistory(
    @Param('user1') user1: string,
    @Param('user2') user2: string,
  ) {
    return this.chatService.findChat(user1, user2);
  }
}
