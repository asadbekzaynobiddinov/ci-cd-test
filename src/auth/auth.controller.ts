import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { responseHandler } from 'src/utils/response.handler';
import { Response } from 'express';
import { VerifyDto } from './dto/verifyDto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: `Ro'yxatdan o'tish` })
  @Post('register')
  async register(@Body() user: CreateUserDto, @Res() res: Response) {
    const result = await this.authService.register(user);
    responseHandler(result, res);
  }

  @ApiOperation({ summary: 'Tizimga kirish' })
  @Post('login')
  async login(@Body() user: CreateAuthDto, @Res() res: Response) {
    const result = await this.authService.login(user);
    if (!result.success) {
      return res.status(result.status).send(result.message);
    }
    return res.status(result.status).json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }

  @ApiOperation({ summary: 'Emailni tasdiqlash' })
  @Post('verify')
  async verify(@Body() verifyDto: VerifyDto) {
    return await this.authService.verify(verifyDto.email, verifyDto.otp);
  }
}
