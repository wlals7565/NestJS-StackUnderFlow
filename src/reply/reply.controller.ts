import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { User } from 'src/common/types/user.type';
import { PatchReplyDto } from './dto/patch-reply.dto';
import { ReplyIdDto } from './dto/reply-id.dto';

@Controller('replies')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('/:replyId')
  deleteReply(@Param() replyIdDto: ReplyIdDto, @GetUser() user: User) {
    return this.replyService.deleteReply(replyIdDto.replyId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:replyId')
  patchReply(
    @Param() replyIdDto: ReplyIdDto,
    @GetUser() user: User,
    @Body() patchReplyDto: PatchReplyDto,
  ) {
    return this.replyService.patchReply(
      replyIdDto.replyId,
      user,
      patchReplyDto.body,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:replyId/recommendations')
  recommend(@Param('replyId') replyId: string, @GetUser() user: User) {
    return this.replyService.recommend(replyId, user);
  }
}
