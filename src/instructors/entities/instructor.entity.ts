import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';
import { Role } from 'src/common/roles.enum';
import { ActiveAccount } from 'src/common/active-account.enum';

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
  @Column()
  birth: Date;
  @Column({
    type: 'enum',
    enum: ActiveAccount,
    default: ActiveAccount.INACTIVE,
    nullable: true,
  })
  active: ActiveAccount;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @DeleteDateColumn()
  deletedAt: Date; //! PARA BORRADO LOGICO
  @OneToMany(() => Class, (clase) => clase.instructor)
  classes: Class[];
}
