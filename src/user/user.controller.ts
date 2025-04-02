import { Controller, Get, Param, UseGuards, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/types/user.type';
import { GetUser } from 'src/common/decorators/get-user-decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:username')
  async getUserInfo(@Param('username') username: string) {
    return this.userService.getUserInfo(username);
  }

  // 기본 이미지로 변경
  @UseGuards(JwtAuthGuard)
  @Post('/my/image/default')
  async changeUserImageToDefaultImage(@GetUser() user: User) {
    return this.userService.changeUserImageToDefaultImage(user.uuid);
  }
}
