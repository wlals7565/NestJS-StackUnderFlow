import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerVote } from './entities/answer-vote.entity';
import { Answer } from './entities/answer.entity';
import { Reply } from 'src/reply/entities/reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerVote, Answer, Reply])],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
