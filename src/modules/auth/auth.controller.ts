import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { UserCreateDto } from 'modules/users/dto/user.create.dto';
import { GoogleAuthGuard } from 'shared/guards/auth-google.guard';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthRefreshTokenDto } from './dto/auth.refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login/refresh-token')
  async getNewTokens(@Body() dto: AuthRefreshTokenDto) {
    return this.authService.getNewTokens(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: UserCreateDto) {
    return this.authService.register(dto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async google() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.authByGoogle(req);
    const redirectUrl = `${process.env.CLIENT_URL}/auth/google?access_token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`;

    return res.redirect(redirectUrl);
  }
}
