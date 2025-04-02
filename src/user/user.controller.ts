import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/types/user.type';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ImagesService } from 'src/images/images.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get('/:username')
  async getUserInfo(@Param('username') username: string) {
    return this.userService.getUserInfo(username);
  }

  // 기본 이미지로 변경
  @UseGuards(JwtAuthGuard)
  @Post('/my/image/default')
  async changeUserProfileImageToDefaultImage(@GetUser() user: User) {
    return this.userService.changeUserImageToDefaultImage(user.uuid);
  }

  // 유저 이미지 변경
  @UseGuards(JwtAuthGuard)
  @Post('/my/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserProfileImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })], // 10MB
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    await this.imagesService.uploadFile(file, user.username, 'profile');
    return await this.userService.uploadUserProfile(user.uuid);
  }
}
