import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { User } from 'src/user/entities/user.entity';

// 게시글 엔티티
// 기본키 UUID 식별자
// 기본 속성 작성자, 제목, 본문, 작성일자, 수정일자, 삭제일자
@Entity()
export class AnswerVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 1은 up -1은 down 투표
  @Column()
  state: number;

  @ManyToOne(() => Answer, (answer) => answer.votes)
  answer: Answer;

  @ManyToOne(() => User, (user) => user.votes)
  voter: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
