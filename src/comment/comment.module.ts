import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommendation } from 'src/recommendation/entities/recommendation.entity';
import { Comment } from './entities/comment.entity';
import { Reply } from 'src/reply/entities/reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recommendation, Comment, Reply])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
