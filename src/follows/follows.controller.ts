import { BadRequestException, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { User } from 'src/common/types/user.type';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/:userId")
  async follow(@GetUser() user:User, @Param('userId') followingUserId: string) {
    if(user.uuid === followingUserId) {
      throw new BadRequestException("자기 자신을 구독 할 수는 없습니다.");
    }
    return this.followsService.follow(user.uuid, followingUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:userId")
  async unfollow(@GetUser() user:User, @Param('userId') followingUserId: string) {
    if(user.uuid === followingUserId) {
      throw new BadRequestException("자기 자신을 구독 취소 할 수는 없습니다.");
    }
    return this.followsService.unfollow(user.uuid, followingUserId);
  }
}
