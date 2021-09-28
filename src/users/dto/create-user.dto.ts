import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsDocAlreadyInUse } from '../validations/users.doc-constraint';
import { IsWhatsappAlreadyInUse } from '../validations/users.whatsapp-constraint';
import { getUniqueErrorMessage } from '../../constants/error.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  socialName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsDocAlreadyInUse({ message: getUniqueErrorMessage('doc') })
  doc: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsWhatsappAlreadyInUse({ message: getUniqueErrorMessage('whatsapp') })
  whatsapp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
