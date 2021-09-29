import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsDocAlreadyInUse } from '../validations/users.doc-constraint';
import { IsWhatsappAlreadyInUse } from '../validations/users.whatsapp-constraint';
import { getUniqueErrorMessage } from '../../constants/error.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  socialName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDocAlreadyInUse({ message: getUniqueErrorMessage('doc') })
  doc: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsWhatsappAlreadyInUse({ message: getUniqueErrorMessage('whatsapp') })
  whatsapp: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
