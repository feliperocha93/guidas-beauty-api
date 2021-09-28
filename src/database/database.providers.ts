import { createConnection } from 'typeorm';
import { DATABASE_PROVIDE } from '../constants/database.constants';

export const databaseProviders = [
  {
    provide: DATABASE_PROVIDE,
    useFactory: async () =>
      await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'guidas_beauty',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
  },
];
