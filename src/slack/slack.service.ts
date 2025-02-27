import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SlackService {
  private readonly slackWebhookUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.slackWebhookUrl = configService.get<string>('SLACK_WEBHOOK');
  }

  async sendMessage(message: string) {
    if (!this.slackWebhookUrl) {
      console.error('SLACK_WEBHOOK_URL is not set');
      return;
    }

    try {
      await axios.post(this.slackWebhookUrl, { text: message });
    } catch (error) {
      console.error('Failed to send Slack message:', error);
    }
  }

  async onModuleInit() {
    await this.sendMessage('✅ 서버가 시작되었습니다.');
  }

  async onModuleDestroy() {
    await this.sendMessage('🛑 서버가 종료되었습니다.');
  }
}
