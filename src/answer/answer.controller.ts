import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VoteQueryOption } from 'src/post/dto/vote-query-option.dto';
import { User } from 'src/common/types/user.type';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { CreateReplyDto } from './dto/create-reply.dto';
import { AnswerIdDto } from './dto/answer-id.dto';
import { PatchAnswerDto } from './dto/patch-answer.dto';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // 답변 삭제
  @UseGuards(JwtAuthGuard)
  @Delete('/:answerId')
  deleteAnswer(@Param('answerId') answerId: string, @GetUser() user: User) {
    return this.answerService.deleteAnswer(answerId, user);
  }

  // 답변 수정
  @UseGuards(JwtAuthGuard)
  @Patch('/:answerId')
  patchAnswer(
    @Param('answerId') answerId: string,
    @GetUser() user: User,
    @Body() patchAnswerDto: PatchAnswerDto,
  ) {
    return this.answerService.patchAnswer(answerId, user, patchAnswerDto.body);
  }

  // 추천하기
  @UseGuards(JwtAuthGuard)
  @Post('/:answerId/vote')
  vote(
    @Param() answerId: AnswerIdDto,
    @Query() voteQueryOption: VoteQueryOption,
    @GetUser() user: User,
  ) {
    return this.answerService.vote(
      answerId.answerId,
      voteQueryOption.vote,
      user,
    );
  }

  // 답글에 대한 댓글
  /*
  @UseGuards(JwtAuthGuard)
  @Post('/:answerId/replies')
  reply(
    @Param('answerId') answerId: string,
    @GetUser() user: User,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    console.log('hello');
    retur
    */
}
