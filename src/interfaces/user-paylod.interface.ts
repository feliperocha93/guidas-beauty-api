import { UserRole } from '../enums/user-role.enum';

export interface UserPayload {
  id: number;
  role: UserRole;
  whatsapp: string;
}
