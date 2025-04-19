import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Alarm from "./entities/alarm.entity";
import AlarmService from "./alarm.service";

@Module({
  imports: [TypeOrmModule.forFeature([Alarm])],
  providers: [AlarmService],
  exports: [AlarmService],

})
export default class AlarmModule {

}