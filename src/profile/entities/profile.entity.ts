import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'unknown' })
  picturePath: string;

  @Column({ default: '' })
  location: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  aboutMe: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
