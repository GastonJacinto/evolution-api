import {
  Entity,
  Column,
  DeleteDateColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'src/common/roles.enum';
import { Genre } from 'src/common/genres.enum';
import { Class } from 'src/classes/entities/class.entity';
import { ActiveAccount } from 'src/common/active-account.enum';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
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
  @Column({ unique: true })
  dni: string;
  @Column({ select: false })
  password: string;
  @Column()
  genre: Genre;
  @Column({ default: 0, nullable: true })
  remaining_classes: number;
  @Column()
  birth: Date;
  @Column({
    type: 'enum',
    enum: ActiveAccount,
    default: ActiveAccount.ACTIVE,
    nullable: true,
  })
  active: ActiveAccount;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @DeleteDateColumn()
  deletedAt: Date; //! PARA BORRADO LOGICO
  @ManyToMany(() => Class, (clase) => clase.students)
  classes: Class[];
}
