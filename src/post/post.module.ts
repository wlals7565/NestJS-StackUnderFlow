import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Vote } from './entities/vote.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Answer } from 'src/answer/entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Vote, Comment, Answer])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
