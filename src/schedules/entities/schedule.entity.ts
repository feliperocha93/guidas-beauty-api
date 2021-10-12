import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  schedule: Date;

  @ManyToOne(() => Address, (address) => address.id)
  addressId: number;

  @Column({ default: false })
  reserved: boolean;

  @ManyToOne(() => User, (user) => user.id)
  userId?: number;

  @Column()
  bookingDate?: Date;

  @Column()
  accomplished?: boolean;
}
