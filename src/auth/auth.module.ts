// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';               // ← pastikan import ini
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';   // ← jika pakai .env
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),                  // ← load .env sekali saja
    PassportModule.register({ defaultStrategy: 'jwt' }),       // ← daftar Passport
    JwtModule.registerAsync({                                  // ← daftarkan JwtModule dengan .env
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // ← User schema
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],                      // ← guard tidak perlu di-provider
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
