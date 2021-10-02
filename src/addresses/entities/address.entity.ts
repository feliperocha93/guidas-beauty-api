import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  description?: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  cep: string;
}
