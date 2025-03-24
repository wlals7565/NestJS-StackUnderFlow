import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';

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
      secure: true,
      sameSite: 'none',
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
  @Get('checkAuthStatus')
  async checkAuthStatus(@Req() request: Request) {
    if (request.cookies?.['access_token']) {
      const result = await this.authService.checkJWT(
        request.cookies['access_token'],
      );
      return result;
    }
    return { msg: 'No Content' };
  }

  //로그아웃
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // access_token 쿠키 제거
    res.clearCookie('access_token', {
      httpOnly: true,
      maxAge: 0,
      secure: true,
      sameSite: 'none',
    });

    return { message: 'Logged out successfully.' };
  }
}
