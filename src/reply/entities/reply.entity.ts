import { Answer } from 'src/answer/entities/answer.entity';
import { ReplyRecommendation } from 'src/recommendation/entities/reply-cormmendation.entity';
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

@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user.replies)
  author: User;

  @ManyToOne(() => Answer, (answer) => answer.replies)
  answer: Answer;

  @OneToMany(
    () => ReplyRecommendation,
    (recommendation) => recommendation.reply,
  )
  recommendations: ReplyRecommendation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
