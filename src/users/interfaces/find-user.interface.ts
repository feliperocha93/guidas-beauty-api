import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class FindUserInterface {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  socialName?: string;

  @IsOptional()
  @IsString()
  doc?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: UserRole;
  //TODO: pass type as UserRole
}
