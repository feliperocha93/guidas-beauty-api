import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  cep: string;
}
