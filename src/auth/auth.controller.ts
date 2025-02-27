import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { User } from 'src/common/types/user.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // 로그인
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    res.json(result);
  }

  // 회원가입
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    if (signupDto.password != signupDto.passwordConfirm) {
      throw new BadRequestException(
        "password and passwordConfirm doesn't match",
      );
    }
    return this.authService.signup(signupDto);
  }

  //로그인 여부 확인
  @UseGuards(JwtAuthGuard)
  @Get('checkAuthStatus')
  async checkAuthStatus(@GetUser() user: User) {
    return user;
  }

  //로그아웃
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // access_token 쿠키 제거
    res.clearCookie('access_token', {
      httpOnly: true,
      maxAge: 0, // 쿠키를 즉시 만료시킴
    });

    return { message: 'Logged out successfully.' };
  }
}
