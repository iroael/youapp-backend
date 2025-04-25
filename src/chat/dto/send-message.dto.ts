import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'user123' })
  @IsString()
  senderId: string;

  @ApiProperty({ example: 'user456' })
  @IsString()
  receiverId: string;

  @ApiProperty({ example: 'Hello, how are you?' })
  @IsString()
  content: string;
}