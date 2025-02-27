import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/types/user.type';
import { ReplyRecommendation } from 'src/recommendation/entities/reply-cormmendation.entity';
import { Repository } from 'typeorm';
import { Reply } from './entities/reply.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(ReplyRecommendation)
    private readonly replyRecommendationRepository: Repository<ReplyRecommendation>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
  ) {}

  async patchReply(replyId: string, user: User, body: string) {
    try {
      const reply = await this.replyRepository.findOne({
        where: { id: replyId },
        relations: ['author'],
      });
      if (!reply) {
        throw new BadRequestException(`reply with id: ${replyId} isn't exist`);
      }
      if (reply.author.id !== user.uuid) {
        throw new UnauthorizedException(
          'You are not authorized to patch this reply',
        );
      }
      await this.replyRepository.update({ id: replyId }, { body });
      return { message: 'You successfully patch your reply' };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async deleteReply(replyId: string, user: User) {
    try {
      const reply = await this.replyRepository.findOne({
        where: { id: replyId },
        relations: ['author'],
      });
      if (!reply) {
        throw new BadRequestException(`Reply with id: ${replyId} isn't exist`);
      }
      if (reply.author.id !== user.uuid) {
        throw new UnauthorizedException(
          'You are not authorized to patch this reply',
        );
      }
      await this.replyRepository.softRemove({ id: replyId });
      return { message: 'You successfully delete your reply' };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async recommend(replyId: string, user: User) {
    try {
      const existRecommendation =
        await this.replyRecommendationRepository.findOne({
          where: { reply: { id: replyId }, recommender: { id: user.uuid } },
        });
      if (existRecommendation) {
        return this.replyRecommendationRepository.remove(existRecommendation);
      }
      const newRecommend = this.replyRecommendationRepository.create({
        recommender: { id: user.uuid },
        reply: { id: replyId },
      });
      return await this.replyRecommendationRepository.save(newRecommend);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
