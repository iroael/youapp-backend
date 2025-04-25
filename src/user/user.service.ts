import { Injectable,ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      return await createdUser.save();
    } catch (error) {
      throw new BadRequestException('Gagal membuat user');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password'); // jangan tampilkan password
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }

    if (dto.email) {
      const existing = await this.userModel.findOne({ email: dto.email, _id: { $ne: userId } });
      if (existing) {
        throw new ConflictException(`Email '${dto.email}' sudah digunakan oleh user lain.`);
      }
    }

    Object.assign(user, dto);
    await user.save();

    return {
      message: 'Profil berhasil diperbarui',
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        birthday: user.birthday,
        weight: user.weight,
        height: user.height,
      },
    };
  }
}
