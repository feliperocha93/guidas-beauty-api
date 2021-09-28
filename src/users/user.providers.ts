import { Connection } from 'typeorm';
import {
  DATABASE_PROVIDE,
  USER_REPOSITORY,
} from '../constants/database.constants';
import { User } from './entities/user.entity';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: [DATABASE_PROVIDE],
  },
];
