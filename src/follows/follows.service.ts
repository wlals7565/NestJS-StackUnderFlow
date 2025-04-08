import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follows } from './entities/follows.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follows)
    private readonly followsRepository: Repository<Follows>,
  ) {}

  async follow(userId: string, followingUserId: string) {
    try {
      const existFollow = await this.followsRepository.findOne({
        where: { follower: { id: userId }, following: { id: followingUserId } },
      });
      if(existFollow) {
        throw new BadRequestException("이미 구독 한 상대를 다시 구독 할 수 없습니다.")
      }
      const newFollow = this.followsRepository.create({follower: {id: userId}, following: {id: followingUserId}})
      await this.followsRepository.save(newFollow);
      return {message: "성공적으로 상대를 구독 하였습니다."}
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '서버에서 오류가 발생하였습니다. 나중에 다시 시도해 주세요.',
      );
    }
  }

  async unfollow(userId: string, followingUserId: string) {
    try {
      const existFollow = await this.followsRepository.findOne({
        where: { follower: { id: userId }, following: { id: followingUserId } },
      });
      if(!existFollow) {
        throw new BadRequestException("구독하지 않은 상대를 구독 취소 할 수는 없습니다..")
      }
      await this.followsRepository.softRemove(existFollow);
      return {message: "성공적으로 상대를 구독취소 하였습니다."}
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '서버에서 오류가 발생하였습니다. 나중에 다시 시도해 주세요.',
      );
    }
  }
}
