import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    // JWT 인증 과정 중 발생한 에러 처리
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        // 토큰이 만료된 경우
        throw new UnauthorizedException(
          'Your token has expired. Please log in again.',
        );
      }
      if (info?.name === 'JsonWebTokenError') {
        // 토큰 형식이 잘못된 경우
        throw new UnauthorizedException(
          'Your token is invalid. Please provide a valid token.',
        );
      }
      if (!user) {
        // 토큰이 없는 경우
        throw new UnauthorizedException(
          'Authentication token is missing. Please log in.',
        );
      }

      // 기타 인증 관련 예외
      throw new UnauthorizedException(
        err?.message || 'Authentication failed. Please try again.',
      );
    }

    // 인증 성공 시 사용자 정보 반환
    return user;
  }
}
