import { IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  role?: UserRole;
}
