import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Alarm from 'src/alarm/entities/alarm.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class NotificationService {
  constructor(
    @InjectRepository(Alarm)
    private readonly AlarmRepository: Repository<Alarm>,
  ) {}

  async getAllAlarms(userId: string) {
    try {
      const allAlarms = await this.AlarmRepository.find({where: {notifiedUser: {id: userId}}})
      return allAlarms
    }
    catch(error) {
      console.error(error)
      if(error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async deleteAllAlarms(userId: string) {
    try {
      await this.AlarmRepository.softDelete({notifiedUser: {id: userId}});
      return {message: "성공적으로 모든 소식을 삭제하였습니다."};
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException;
    }
  }

  async deleteAlarm(userId: string, alarmId: string) {
    try {
      const result = await this.AlarmRepository.softDelete({notifiedUser: {id: userId}, id: alarmId})
      if(!result.affected) {
        throw new BadRequestException("존재하지 않거나 이미 삭제된 소식을 삭제할 수는 없습니다.")
      }
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException;
    }
  }
}
