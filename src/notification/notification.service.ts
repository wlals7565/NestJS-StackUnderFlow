import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
}
