import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    console.log('→ [Strategy] Decoded JWT payload:', payload);  // Menampilkan payload yang didecode
    const user = await this.userModel.findById(payload.sub).exec();
    console.log('→ [Strategy] User from DB:', user);  // Menampilkan user yang ditemukan
    if (!user) {
      console.log('→ [Strategy] No user, throwing Unauthorized');
      throw new UnauthorizedException('Invalid token');
    }
    return { _id: user._id.toString(), email: user.email };
  }
}
