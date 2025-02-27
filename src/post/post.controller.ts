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

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

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

  @UseGuards()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
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
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @GetUser() user: User,
  ) {
    return this.postService.createComment(createCommentDto, postId, user);
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
