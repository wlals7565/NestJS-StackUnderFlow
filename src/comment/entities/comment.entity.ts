import { Post } from 'src/post/entities/post.entity';
import { Recommendation } from 'src/recommendation/entities/recommendation.entity';
import { Reply } from 'src/reply/entities/reply.entity';
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

// 댓글
// 작성자, 본문, 작성일자, 수정일자, 삭제일자
@Entity()
export class Comment {
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

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @OneToMany(() => Recommendation, (Recommendation) => Recommendation.comment)
  recommendations: Recommendation[];

  @OneToMany(() => Reply, (reply) => reply.parent)
  replies: Reply[];
}
