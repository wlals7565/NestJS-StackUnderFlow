import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follows } from './entities/follows.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follows])],
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule {}
