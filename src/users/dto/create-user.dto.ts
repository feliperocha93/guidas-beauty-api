import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsDocAlreadyInUse } from '../validations/users.doc-constraint';
import { IsWhatsappAlreadyInUse } from '../validations/users.whatsapp-constraint';
import { getUniqueErrorMessage } from '../../constants/error.constants';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  socialName?: string;

  @IsString()
  @IsNotEmpty()
  @IsDocAlreadyInUse({ message: getUniqueErrorMessage('doc') })
  doc: string;

  @IsString()
  @IsNotEmpty()
  @IsWhatsappAlreadyInUse({ message: getUniqueErrorMessage('whatsapp') })
  whatsapp: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
