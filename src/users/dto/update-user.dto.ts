import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  role?: UserRole;
}
