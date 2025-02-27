import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/types/user.type';
import { AnswerVote } from './entities/answer-vote.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateReplyDto } from 'src/answer/dto/create-reply.dto';
import { Reply } from 'src/reply/entities/reply.entity';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerVote)
    private readonly answerVoteRepository: Repository<AnswerVote>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}
  async deleteAnswer(answerId: string, user: User) {
    try {
      const answer = await this.answerRepository.findOne({
        where: { id: answerId },
        relations: ['author'],
      });
      if (!answer) {
        throw new BadRequestException(
          `answer with id: ${answerId} isn't exist`,
        );
      }
      if (answer.author.id !== user.uuid) {
        throw new UnauthorizedException(
          'You are not authorized to delete this answer',
        );
      }
      await this.answerRepository.softRemove(answer);
      return { message: 'You successfully delete the answer' };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async patchAnswer(answerId: string, user: User, body: string) {
    try {
      const answer = await this.answerRepository.findOne({
        where: { id: answerId },
        relations: ['author'],
      });
      if (!answer) {
        throw new BadRequestException(
          `answer with id: ${answerId} isn't exist`,
        );
      }
      if (answer.author.id !== user.uuid) {
        throw new UnauthorizedException(
          'You are not authorized to patch this answer',
        );
      }
      await this.answerRepository.update({ id: answerId }, { ...answer, body });
      return { message: 'You successfully update your answer' };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async vote(answerId: string, vote: number, user: User) {
    try {
      const existVote = await this.answerVoteRepository.findOne({
        where: { voter: { id: user.uuid }, answer: { id: answerId } },
      });
      if (existVote) {
        // 투표가 동일하면 삭제
        if (existVote.state == vote) {
          await this.answerVoteRepository.remove(existVote);
        }
        // 투표 상태를 반전시켜서 업데이트
        else {
          await this.answerVoteRepository.update(
            existVote.id, // 업데이트할 항목의 id
            { state: existVote.state * -1 }, // state 값을 반전시켜서 업데이트
          );
        }
      }
      // 만약 투표가 없으면 새로 생성
      else {
        await this.answerVoteRepository.save({
          voter: { id: user.uuid },
          state: vote,
          answer: { id: answerId },
        });
      }
      const result = await this.answerVoteRepository.findOne({
        where: { answer: { id: answerId } },
        relations: ['voter'],
      });
      return plainToInstance(AnswerVote, result);
    } catch (err) {
      // 에러 처리 로직 추가
      console.error(err);
    }
  }

  async reply(answerId: string, createReplyDto: CreateReplyDto, user: User) {
    const reply = this.replyRepository.create({
      body: createReplyDto.body,
      author: { id: user.uuid },
      answer: { id: answerId },
    });
    try {
      const newReply = await this.replyRepository.save(reply);
      const result = await this.replyRepository.findOne({
        where: { id: newReply.id },
        relations: ['author'],
      });
      return plainToInstance(Reply, result);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
