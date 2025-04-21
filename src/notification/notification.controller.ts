import { Controller, UseGuards, Get } from '@nestjs/common';
import NotificationService from './notification.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/types/user.type';
import { GetUser } from 'src/common/decorators/get-user-decorator';

@Controller('/notifications')
export default class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllAlarms (@GetUser() user: User) {
    const allAlarms = await this.notificationService.getAllAlarms(user.uuid);
    return allAlarms
  }
}
