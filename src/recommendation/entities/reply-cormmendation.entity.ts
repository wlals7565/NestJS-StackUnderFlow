import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Reply } from 'src/reply/entities/reply.entity';

@Entity()
export class ReplyRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Reply, (reply) => reply.id)
  reply: Reply;

  @ManyToOne(() => User, (user) => user.id)
  recommender: User;
}
