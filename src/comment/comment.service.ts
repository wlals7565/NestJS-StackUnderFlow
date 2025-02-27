import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/common/types/user.type';
import { Recommendation } from 'src/recommendation/entities/recommendation.entity';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly recommendationRepository: Repository<Recommendation>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async deleteComment(commentId: string, user: User) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['author'],
      });

      if (!comment) {
        throw new BadRequestException(
          `Comment with id ${commentId} isn't exist`,
        );
      }

      if (comment.author.id != user.uuid) {
        throw new UnauthorizedException(
          'You are not authorized to delete this comment.',
        );
      }

      await this.commentRepository.softRemove(comment);

      return { messasge: 'Delete comment is successful' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async patchComment(commentId: string, user: User, body: string) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['author'],
      });
      if (!comment) {
        throw new BadRequestException(
          `Comment with id ${commentId} isn't exist`,
        );
      }
      if (comment.author.id !== user.uuid) {
        throw new UnauthorizedException(
          'You are not authorized to patch this comment.',
        );
      }
      await this.commentRepository.update({ id: commentId }, { body });
      return { message: 'You Successfully edited comment.' };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async recommend(commentId: string, user: User) {
    try {
      const recommendation = await this.recommendationRepository.findOne({
        where: { comment: { id: commentId }, recommender: { id: user.uuid } },
      });
      if (recommendation) {
        const result =
          await this.recommendationRepository.remove(recommendation);
        return plainToInstance(Recommendation, result);
      } else {
        const newrecommend = this.recommendationRepository.create({
          comment: { id: commentId },
          recommender: { id: user.uuid },
        });
        const result = await this.recommendationRepository.save(newrecommend);
        return plainToInstance(Recommendation, result);
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAllrecommendations(commentId: string) {
    const recommendations = await this.recommendationRepository.find({
      where: { comment: { id: commentId } },
      relations: ['recommender'],
    });
    return plainToInstance(Recommendation, recommendations);
  }
}
