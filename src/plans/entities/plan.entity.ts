import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'plans' })
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  image: string;
  @Column()
  price: number;
  @Column()
  description: string;
  @Column()
  credits: number;
}
