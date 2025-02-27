import {
  Controller,
  Get,
  Param,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ForbiddenException,
  Patch,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { User } from 'src/common/types/user.type';
import { PatchUserProfileAboutMeDto } from './dto/patch-user-profile-about-me.dto';

const avatarUploadOption = {
  storage: diskStorage({
    destination: path.join(__dirname, '..', 'assets', 'images', 'avatars'),
    filename: (req, file, callback) => {
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      callback(null, fileName);
    },
  }),
  fileFilter: (req: Request, file, cb) => {
    const user = (req as any).user;
    const requestedUsername = (req as any).params.username; // URL에서 받은 username

    if (user.username !== requestedUsername) {
      return cb(
        new ForbiddenException('다른 사용자의 프로필을 변경할 수 없습니다.'),
        false,
      );
    }

    cb(null, true); // 검증 통과 시 업로드 허용
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 최대 2MB 제한
  },
};

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get('/:userName')
  async getUserProfile(
    @Param('userName') userName: string,
    @Res() res: Response,
  ) {
    const result = await this.profileService.getUserProfile(userName);
    if (!result) {
      return res.status(204).send(undefined);
    }
    return res.send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:username/avatar/upload')
  @UseInterceptors(FileInterceptor('avatar', avatarUploadOption))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    this.profileService.uploadAvatar(user.uuid, file.filename);
    return { imageUrl: file.filename };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:username')
  patchUserProfileAboutMe(
    @GetUser() user: User,
    @Body() patchUserProfileAboutMeDto: PatchUserProfileAboutMeDto,
    @Param('username') username: string,
  ) {
    if (username != user.username) {
      throw new BadRequestException();
    }
    return this.profileService.patchUserProfileAboutMe(
      user,
      patchUserProfileAboutMeDto,
    );
  }
}
