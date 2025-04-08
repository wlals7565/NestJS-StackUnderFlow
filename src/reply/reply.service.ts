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
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
  ) {}

  async deleteReply(replyId: string, user: User) {
    try {
      await this.replyRepository.softDelete({
        id: replyId,
        author: { id: user.uuid },
      });
      return { message: '성공적으로 답글이 삭제되었습니다.' };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async patchReply(replyId: string, user: User, body: string) {
    try {
      const result = await this.replyRepository.update(
        { id: replyId, author: { id: user.uuid } },
        { body },
      );
      if(result.affected === 0) {
        throw new BadRequestException("존재하지 않거나 삭제된 답글은 수정할 수 없습니다.");
      }
      return {message: "성공적으로 답글을 수정하였습니다."}
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
