import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import { ReplyRecommendation } from 'src/recommendation/entities/reply-cormmendation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, ReplyRecommendation])],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
