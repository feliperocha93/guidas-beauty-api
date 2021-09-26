import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsDocAlreadyInUse } from '../validations/users.doc-constraint';
import { IsWhatsappAlreadyInUse } from '../validations/users.whatsapp-constraint';
import { getUniqueErrorMessage } from '../../constants/error';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  socialName?: string;

  @IsNotEmpty()
  @IsDocAlreadyInUse({ message: getUniqueErrorMessage('doc') })
  doc: string;

  @IsNotEmpty()
  @IsWhatsappAlreadyInUse({ message: getUniqueErrorMessage('whatsapp') })
  whatsapp: string;

  @IsNotEmpty()
  password: string;
}
