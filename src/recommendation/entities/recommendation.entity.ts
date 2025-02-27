import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Comment, (comment) => comment.id)
  comment: Comment;

  @ManyToOne(() => User, (user) => user.id)
  recommender: User;
}
