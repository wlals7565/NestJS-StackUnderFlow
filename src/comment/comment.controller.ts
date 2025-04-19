import {
  Controller,
  Param,
  Post,
  UseGuards,
  Get,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { User } from 'src/common/types/user.type';
import { PatchCommentDto } from './dto/patch-comment.dto';
import { CreateReplyDto } from 'src/comment/dto/create-reply.dto';
import AlarmService from 'src/alarm/alarm.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService, private readonly alarmService: AlarmService) {}

  // 댓글 삭제하기
  @UseGuards(JwtAuthGuard)
  @Delete('/:commentId')
  deleteComment(@Param('commentId') commentId: string, @GetUser() user: User) {
    return this.commentService.deleteComment(commentId, user);
  }
  // 댓글 수정하기
  @UseGuards(JwtAuthGuard)
  @Patch('/:commentId')
  patchComment(
    @Param('commentId') commentId: string,
    @GetUser() user: User,
    @Body() patchCommentDto: PatchCommentDto,
  ) {
    return this.commentService.patchComment(
      commentId,
      user,
      patchCommentDto.body,
    );
  }

  // 댓글에 추천누르기
  @UseGuards(JwtAuthGuard)
  @Post('/:commentId/recommendations')
  recommend(@Param('commentId') commentId: string, @GetUser() user: User) {
    return this.commentService.recommend(commentId, user);
  }

  // 댓글의 모든 추천 가져오기
  @Get('/:commentId/recommendations')
  getAllrecommendations(@Param('commentId') commentId: string) {
    return this.commentService.getAllrecommendations(commentId);
  }

  // 댓글에 답글 달기
  @UseGuards(JwtAuthGuard)
  @Post('/:commentId/reply')
  async addReplyToComment(
    @Param('commentId') commentId: string,
    @GetUser() user: User,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    const result = await this.commentService.replyToComment(
      commentId,
      createReplyDto,
      user.uuid,
    );
    if(user.uuid === createReplyDto.to) return result;
    this.alarmService.saveAlarm({content: createReplyDto.body, title: "댓글에 대한 답글이 달렸습니다.", url: `questions/${createReplyDto.postId}`}, createReplyDto.to)
    return result
  }

  // 특정 댓글의 모든 답글 가져오기
  @Get('/:commentId/replies')
  async getAllReplies(@Param('commentId') commentId: string) {
    return this.commentService.getAllReplies(commentId);
  }
}
