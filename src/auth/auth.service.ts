// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto): Promise<{ token: string }> {
    const { email, password } = authDto;
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    // sekarang TS tahu _id itu ObjectId, .toString() aman
    const payload = { sub: user._id.toString(), email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: '24h' });
    // console.log('→ [AuthService] JWT Token:', token); // Menampilkan token yang dibuat
    console.log('→ [AuthService] Payload:', payload); // Menampilkan payload yang digunakan untuk membuat token
    // console.log('→ [AuthService] User:', user); // Menampilkan informasi user yang berhasil login 
    return { token };
  }

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const { email, password, fullName } = dto;

    if (await this.userModel.exists({ email })) {
      throw new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        message : 'Email ini sudah terdaftar. Silakan login atau gunakan email lain.',
      });
    }

    const hashed = await bcrypt.hash(password, await bcrypt.genSalt());
    await this.userModel.create({ email, password: hashed, fullName });

    return { message: 'Berhasil mendaftar. Silakan login.' };
  }
}
