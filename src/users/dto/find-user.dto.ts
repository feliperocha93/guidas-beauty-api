import { IsInt, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class FindUserDto {
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

  //TODO: Validate if role is enum type
  @IsOptional()
  @IsString()
  role?: UserRole;
}
