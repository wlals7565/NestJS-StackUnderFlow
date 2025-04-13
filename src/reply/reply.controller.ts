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

@Controller('replies')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('/:replyId')
  deleteReply(@Param('replyId') replyId: string, @GetUser() user: User) {
    return this.replyService.deleteReply(replyId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:replyId')
  patchReply(@Param('replyId') replyId: string, @GetUser() user: User, @Body() pathReplyDto:PatchReplyDto) {
    return this.replyService.patchReply(replyId, user, pathReplyDto.body)
  }

}
