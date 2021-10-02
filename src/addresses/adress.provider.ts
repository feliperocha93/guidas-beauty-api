import { Connection } from 'typeorm';
import { Address } from './entities/address.entity';
import {
  DATABASE_PROVIDE,
  ADDRESS_REPOSITORY,
} from '../constants/database.constants';

export const addressProviders = [
  {
    provide: ADDRESS_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(Address),
    inject: [DATABASE_PROVIDE],
  },
];
