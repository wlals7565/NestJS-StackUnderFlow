import { Controller, UseGuards, Get, Delete, Param } from '@nestjs/common';
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

  // 전체 알람 삭제
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllAlarms (@GetUser() user: User) {
    return await this.notificationService.deleteAllAlarms(user.uuid);
  }

  // 하나의 알람 삭제
  @UseGuards(JwtAuthGuard)
  @Delete("/:alarmId")
  async deleteAlarm (@GetUser() user: User, @Param('alarmId') alarmId: string) {
    return await this.notificationService.deleteAlarm(user.uuid, alarmId)
  }
}
