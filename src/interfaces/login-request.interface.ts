import { IncomingMessage } from 'http';
import { User } from '../users/entities/user.entity';

export interface LoginRequest extends IncomingMessage {
  user: User;
}
