import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { User } from 'src/common/types/user.type';
import { QueryOptionDto } from './dto/query-option.dto';
import { VoteQueryOption } from './dto/vote-query-option.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import AlarmService from 'src/alarm/alarm.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService, private readonly alarmService: AlarmService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll(@Query() queryOption: QueryOptionDto) {
    return this.postService.findAll(queryOption);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    console.log(updatePostDto);
    return this.postService.update(id, updatePostDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.postService.remove(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/vote')
  vote(
    @Param('postId') postId: string,
    @Query() voteQueryOption: VoteQueryOption,
    @GetUser() user: User,
  ) {
    return this.postService.vote(postId, voteQueryOption.vote, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @GetUser() user: User,
  ) {
    const result = await this.postService.createComment(createCommentDto, postId, user);
    
    // 자기 자신에게는 알람을 보낼 필요가 없으므로 바로 응답 보내기
    if(createCommentDto.to === user.uuid) {
      return result;
    }
    // 자기 자신이 아닌 사람에게 댓글을 달았다면 알람 생성하기
    this.alarmService.saveAlarm({title: `게시글에 댓글이 달렸습니다.`, content: createCommentDto.body, url: `questions/${postId}`}, createCommentDto.to)
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/answers')
  createAnswer(
    @Body() createAnswerDto: CreateAnswerDto,
    @Param('postId') postId: string,
    @GetUser() user: User,
  ) {
    return this.postService.createAnswer(postId, createAnswerDto.body, user);
  }
}
