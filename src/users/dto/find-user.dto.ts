import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class FindUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  socialName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  //TODO: Validate if role is enum type
  @ApiPropertyOptional({ enum: Object.values(UserRole) })
  @IsOptional()
  @IsString()
  role?: UserRole;
}
