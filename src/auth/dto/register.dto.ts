// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the new user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P4asw0rd@123',
    description: 'Password (min. 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the new user',
  })
  @IsString()
  fullName: string;
}
