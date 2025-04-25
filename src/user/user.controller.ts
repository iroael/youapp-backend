import { Controller, Get, Param, Put, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('Profile')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List all users (public)' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (requires JWT)' })
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update Profile (requires JWT)' })
  @ApiBearerAuth('JWT-auth')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() dto: UpdateUserDto, @Req() req) {
    console.log('→ [Controller] req.user:', req.user);
    if (!req.user || !req.user._id) {
      console.log('→ [Controller] Unauthorized: no req.user._id');
      throw new UnauthorizedException();
    }
    const userId = req.user._id;
    console.log(`→ [Controller] updating profile for userId=${userId} with data:`, dto);
    return this.userService.updateUser(userId, dto);
  }
}
