import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Alarm from './entities/alarm.entity';
import { Repository } from 'typeorm';
import { AlarmPayload } from 'src/common/interfaces/alarm.interface';



@Injectable()
export default class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
  ) {}

  // 알람 저장
  async saveAlarm(alarmPayload: AlarmPayload,   notifiedUserUUID: string) {
    try{
      const newAlarm = this.alarmRepository.create({...alarmPayload, notifiedUser: {id: notifiedUserUUID} })
      this.alarmRepository.save(newAlarm)
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException()
    }
  } 
}
