import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserInfo(username: string) {
    const result = await this.userRepository.findOne({
      where: { name: username },
      relations: ['profile'],
    });
    return plainToInstance(User, result);
  }

  async changeUserImageToDefaultImage(userId: string) {
    try {
      this.userRepository.update({ id: userId }, { image: 'default' });
    } catch (error) {
      throw new InternalServerErrorException(
        '서버에서 알 수 없는 오류가 발생하였습니다.',
      );
    }
  }
}
