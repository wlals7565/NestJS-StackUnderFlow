import { Module } from '@nestjs/common';
import NotificationController from './notification.controller';
import NotificationService from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Alarm from 'src/alarm/entities/alarm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alarm])],
  controllers: [NotificationController, ],
  providers: [NotificationService],
})
export default class NotificationModule {}
