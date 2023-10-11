import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Genre } from 'src/common/genres.enum';
import { Class } from 'src/classes/entities/class.entity';
import { Role } from 'src/common/roles.enum';

@Entity({ name: 'instructors' })
export class Instructor {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  lastname: string;
  @Column({ nullable: true })
  image: string;
  @Column({ unique: true })
  email: string;
  @Column()
  phone: string;
  @Column({ type: 'enum', enum: Role, default: Role.INSTRUCTOR })
  role: Role.INSTRUCTOR;
  @Column({ unique: true })
  dni: string;
  @Column({ select: false })
  password: string;
  @Column()
  genre: Genre;
  @Column()
  birth: Date;
  @Column({ default: true, nullable: true })
  active: boolean;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @DeleteDateColumn()
  deletedAt: Date; //! PARA BORRADO LOGICO
  @OneToMany(() => Class, (clase) => clase.instructor)
  classes: Class[];
}
