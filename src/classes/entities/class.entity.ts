import { Instructor } from 'src/instructors/entities/instructor.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'classes' })
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  date: Date;
  @Column()
  limit: number;
  @ManyToOne(() => Instructor, (instructor) => instructor.id)
  instructor: Instructor;
  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date;
  @ManyToMany(() => User, (user) => user.classes)
  @JoinTable()
  students: User[];
}
