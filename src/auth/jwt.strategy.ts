import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { User } from 'src/common/types/user.type';

const cookieExtractor = (req: Request) => {
  if (req && req.cookies) {
    return req.cookies['access_token']; // access_token 쿠키 값 반환
  }
  return null; // 쿠키가 없으면 null 반환
};

type Payload = {
  email: string;
  name: string;
  uuid: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: Payload): Promise<User> {
    return { email: payload.email, username: payload.name, uuid: payload.uuid };
  }
}
