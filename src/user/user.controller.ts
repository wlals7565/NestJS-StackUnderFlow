import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:username')
  async getUserInfo(@Param('username') username: string) {
    return this.userService.getUserInfo(username);
  }
}
