import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { getUniqueErrorMessage } from '../../constants/error.constants';
import { UserRole } from '../../enums/user-role.enum';
import { IsDocAlreadyInUse } from '../validations/users.doc-constraint';
import { IsWhatsappAlreadyInUse } from '../validations/users.whatsapp-constraint';

export class UpdateUserDto {
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
  @IsDocAlreadyInUse({ message: getUniqueErrorMessage('doc') })
  doc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsWhatsappAlreadyInUse({ message: getUniqueErrorMessage('whatsapp') })
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
