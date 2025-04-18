import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/common/types/user.type';
import { QueryOptionDto } from './dto/query-option.dto';
import { plainToInstance } from 'class-transformer';
import { Vote } from './entities/vote.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from 'src/comment/entities/comment.entity';
import { Answer } from 'src/answer/entities/answer.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}
  async create(createPostDto: CreatePostDto, user: User) {
    const newPost = this.postRepository.create({
      ...createPostDto,
      author: { id: user.uuid },
    });
    try {
      return await this.postRepository.save(newPost);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(queryOption: QueryOptionDto) {
    try {
      const queryBuilder = this.postRepository.createQueryBuilder('post');
  
      // 기본 쿼리 설정
      queryBuilder
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.votes', 'votes')
        .leftJoin('post.comments', 'comments')
        .loadRelationCountAndMap('post.commentCount', 'post.comments')
        .where(
          queryOption.keyword
            ? { title: ILike(`%${queryOption.keyword}%`) }
            : {},
        );
  
      // sort 옵션에 따른 정렬 설정
      switch(queryOption.sort) {
        case 'newest':
          queryBuilder.orderBy('post.createdAt', 'DESC');
          break;
        case 'oldest':
          queryBuilder.orderBy('post.createdAt', 'ASC');
          break;
        case 'like':
          // 서브쿼리를 사용하여 투표 수 카운트
          const voteSubQuery = this.postRepository.manager
            .createQueryBuilder()
            .select('COUNT("vote"."id")', 'vote_count')
            .from('vote', 'vote')
            .where('vote.post_id = post.id');
            
          queryBuilder.addSelect(`(${voteSubQuery.getQuery()})`, 'vote_count')
            .orderBy('vote_count', 'DESC')
            .addOrderBy('post.createdAt', 'DESC');
          break;
        case 'view':
          queryBuilder.orderBy('post.views', 'DESC')
            .addOrderBy('post.createdAt', 'DESC');
          break;
        case 'comment':
          // 서브쿼리를 사용하여 댓글 수 카운트
          const commentSubQuery = this.postRepository.manager
            .createQueryBuilder()
            .select('COUNT("comment"."id")', 'comment_count')
            .from('comment', 'comment')
            .where('comment.post_id = post.id')
            .andWhere('comment.deleted_at IS NULL');
            
          queryBuilder.addSelect(`(${commentSubQuery.getQuery()})`, 'comment_count')
            .orderBy('comment_count', 'DESC')
            .addOrderBy('post.createdAt', 'DESC');
          break;
        default:
          // 기본값은 최신순
          queryBuilder.orderBy('post.createdAt', 'DESC');
      }
  
      // 페이지네이션 적용
      queryBuilder.skip(queryOption.skip || 0).take(queryOption.limit || 100);
  
      const [result, totalCount] = await queryBuilder.getManyAndCount();
      const posts = plainToInstance(Post, result);
  
      return { posts, totalCount };
    } catch (error) {
      console.error('Query error:', error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<Post> {
    const queryRunner =
      this.postRepository.manager.connection.createQueryRunner();

    try {
      // 트랜잭션 시작
      await queryRunner.startTransaction();

      // 게시글 조회 (comments와 answers를 최신순으로 가져오기)
      const post = await queryRunner.manager
        .createQueryBuilder(Post, 'post')
        .leftJoinAndSelect('post.comments', 'comments')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.votes', 'votes')
        .leftJoinAndSelect('votes.voter', 'voteVoter')
        .leftJoinAndSelect('comments.author', 'commentAuthor')
        .leftJoinAndSelect('author.followers', 'followers')
        .leftJoinAndSelect('followers.follower', 'followerUser')
        .loadRelationCountAndMap('comments.replyCount', 'comments.replies')
        .where('post.id = :id', { id })
        .orderBy('comments.createdAt', 'ASC') // comments 최신순 정렬
        .getOne();

      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      await queryRunner.manager
        .createQueryBuilder()
        .update(Post)
        .set({ views: () => 'views + 1' }) // `views` 필드를 1 증가
        .where('id = :id', { id })
        .execute();

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      // `plainToInstance`를 사용하여 반환 데이터 포맷 변환
      return plainToInstance(Post, post);
    } catch (error) {
      console.error(error);
      // 오류 발생 시 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '게시글 처리 중 문제가 발생했습니다.',
      );
    } finally {
      // 트랜잭션 종료
      await queryRunner.release();
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User) {
    try {
      const result = await this.postRepository.update(
        {
          id,
          author: { id: user.uuid },
        },
        updatePostDto,
      );

      // 수정하고자 하는 게시글이 없을 때
      if (result.affected === 0) {
        throw new NotFoundException(
          '게시글을 찾을 수 없거나 수정할 권한이 없습니다.',
        );
      }

      return { message: '게시글이 성공적으로 수정되었습니다.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // 예상치 못한 에러 처리
      throw new InternalServerErrorException(
        '게시글 업데이트 중 문제가 발생했습니다.',
      );
    }
  }

  async remove(id: string, user: User) {
    try {
      // 게시글 삭제 시 조건을 추가하여 작성자와 ID 모두 확인
      const result = await this.postRepository.softDelete({
        id,
        author: { id: user.uuid },
      });

      // 삭제된 행이 없으면 예외 처리
      if (result.affected === 0) {
        throw new NotFoundException(
          '게시글을 찾을 수 없거나 삭제할 권한이 없습니다.',
        );
      }

      // 삭제 성공 메시지 반환
      return { message: '게시글이 성공적으로 삭제되었습니다.' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // 예상치 못한 에러 처리
      throw new InternalServerErrorException(
        '게시글 삭제 중 문제가 발생했습니다.',
      );
    }
  }

  async vote(postId: string, vote: number, user: User) {
    try {
      const existVote = await this.voteRepository.findOne({
        where: { post: { id: postId }, voter: { id: user.uuid } },
      });
      if (existVote) {
        // 투표가 동일하면 삭제
        if (existVote.state == vote) {
          await this.voteRepository.remove(existVote);
        }
        // 투표 상태를 반전시켜서 업데이트
        else {
          await this.voteRepository.update(
            existVote.id, // 업데이트할 항목의 id
            { state: existVote.state * -1 }, // state 값을 반전시켜서 업데이트
          );
        }
      }
      // 만약 투표가 없으면 새로 생성
      else {
        await this.voteRepository.save({
          post: { id: postId },
          voter: { id: user.uuid },
          state: vote,
        });
      }
      const result = await this.voteRepository.findOne({
        where: { post: { id: postId }, voter: { id: user.uuid } },
        relations: ['voter'],
      });
      return plainToInstance(Vote, result);
    } catch (err) {
      // 에러 처리 로직 추가
      console.error(err);
    }
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    postId: string,
    user: User,
  ) {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      post: { id: postId },
      author: { id: user.uuid },
    });
    try {
      const newComment = await this.commentRepository.save(comment);
      const result = await this.commentRepository.findOne({
        where: { id: newComment.id },
        relations: ['recommendations', 'author'],
      });
      return plainToInstance(Comment, result);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createAnswer(postId: string, body: string, user: User) {
    const answer = this.answerRepository.create({
      author: { id: user.uuid },
      body,
      post: { id: postId },
    });
    try {
      const newAnswer = await this.answerRepository.save(answer);
      const result = await this.answerRepository.findOne({
        where: { id: newAnswer.id },
        relations: ['votes', 'votes.voter'],
      });
      return plainToInstance(Answer, result);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
