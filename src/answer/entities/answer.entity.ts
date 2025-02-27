import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnswerVote } from './answer-vote.entity';
import { Post } from 'src/post/entities/post.entity';
import { Reply } from 'src/reply/entities/reply.entity';

// 게시글 엔티티
// 기본키 UUID 식별자
// 기본 속성 작성자, 제목, 본문, 작성일자, 수정일자, 삭제일자
@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  @OneToMany(() => AnswerVote, (vote) => vote.answer)
  votes: AnswerVote[];

  @ManyToOne(() => Post, (post) => post.answers)
  post: Post;

  @OneToMany(() => Reply, (reply) => reply.answer)
  replies: Reply[];
}
