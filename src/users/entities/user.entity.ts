import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
//TODO: Check the best place (file) to keep this enum

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 80, nullable: true })
  socialName: string;

  @Column({ length: 30, unique: true })
  doc: string;

  @Column({ length: 20, unique: true })
  whatsapp: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
