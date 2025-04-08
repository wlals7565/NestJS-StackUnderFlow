import { User } from "src/user/entities/user.entity";
import { CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Follows {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 내가 구독한 사람 (내가 follow 하고 있는 대상)
  @ManyToOne(() => User, user => user.followers)
  following: User;

  // 나를 구독한 사람 (나를 follow 하는 사람)
  @ManyToOne(() => User, user => user.followings)
  follower: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}