import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Alarm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  title: string;

  @Column({nullable: false})
  content: string

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.receivedAlarms)
  notifiedUser: User;
}