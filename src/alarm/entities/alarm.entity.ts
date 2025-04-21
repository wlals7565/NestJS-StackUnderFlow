import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;


  @ManyToOne(() => User, (user) => user.receivedAlarms)
  notifiedUser: User;
}