import { IsOptional, IsString } from 'class-validator';
import { getUniqueErrorMessage } from '../../constants/error.constants';
import { UserRole } from '../../enums/user-role.enum';
import { IsDocAlreadyInUse } from '../validations/users.doc-constraint';
import { IsWhatsappAlreadyInUse } from '../validations/users.whatsapp-constraint';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  socialName?: string;

  @IsOptional()
  @IsString()
  @IsDocAlreadyInUse({ message: getUniqueErrorMessage('doc') })
  doc?: string;

  @IsOptional()
  @IsString()
  @IsWhatsappAlreadyInUse({ message: getUniqueErrorMessage('whatsapp') })
  whatsapp?: string;

  @IsOptional()
  @IsString()
  password?: string;

  //TODO: Validate if role is enum type
  @IsOptional()
  @IsString()
  role?: UserRole;
}
