import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection, useContainer } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/users/entities/user.entity';
import { admUser, userUser } from './test-users';
import { UsersModule } from '../../src/users/users.module';

export const getApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, UsersModule],
  }).compile();

  return moduleFixture.createNestApplication();
};

export const configApp = async (app: INestApplication, module: any) => {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
  );
};

export const addTestUsers = () => {
  const connection = getConnection();
  const repository = connection.getRepository(User);
  repository.clear();
  repository.insert(admUser);
  repository.insert(userUser);
  connection.close();
};
