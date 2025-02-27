import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Profile } from './entities/profile.entity';
import { PatchUserProfileAboutMeDto } from './dto/patch-user-profile-about-me.dto';
import { User as UserType } from 'src/common/types/user.type';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getUserProfile(userName: string) {
    try {
      const userProfile = await this.userRepository.findOne({
        where: { name: ILike(userName) },
        relations: ['profile'],
      });
      return plainToInstance(User, userProfile);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async uploadAvatar(userId: string, imageUrl: string) {
    try {
      this.profileRepository.update(
        { user: { id: userId } },
        {
          picturePath: imageUrl,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async patchUserProfileAboutMe(
    user: UserType,
    patchUserProfileAboutMeDto: PatchUserProfileAboutMeDto,
  ) {
    try {
      await this.profileRepository.update(
        { user: { id: user.uuid } },
        patchUserProfileAboutMeDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
