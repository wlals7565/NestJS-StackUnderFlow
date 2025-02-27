import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { SlackService } from '../../slack/slack.service';

@Catch()
export class SlackExceptionFilter implements ExceptionFilter {
  constructor(private readonly slackService: SlackService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = '서버 내부 오류 발생';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // Slack으로 에러 메시지 전송
    await this.slackService.sendMessage(
      `🚨 서버 오류 발생! \n\n📌 상태 코드: ${status}\n📌 오류 메시지: ${message}`,
    );

    // 클라이언트에 응답
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
