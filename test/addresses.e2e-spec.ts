import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getConnection, Repository, Connection } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { AddressesModule } from '../src/addresses/addresses.module';
import {
  admUser,
  getAdmToken,
  getUserToken,
  userUser,
} from './config/test-users';
import { ROUTES } from '../src/constants/routes.constants';
import { configApp, getApp } from './config/test-init';

const MAIN_ROUTE = ROUTES.ADDRESSES;

describe('Addresses (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let repository: Repository<User>;
  let admToken: string;
  let userToken: string;

  beforeAll(async () => {
    app = await getApp();
    await configApp(app, AddressesModule);
    await app.init();

    // Insert test users
    connection = getConnection();
    repository = connection.getRepository(User);
    repository.clear();
    repository.insert(admUser);
    repository.insert(userUser);

    //Get tokens
    admToken = await getAdmToken(app);
    userToken = await getUserToken(app);
  });

  afterAll(async () => {
    connection.close();
    app.close();
  });

  describe('when try access the route', () => {
    it('should not sucefully access with user credentials', async () => {
      const { status } = await request(app.getHttpServer()).get(MAIN_ROUTE);

      expect(status).toBe(200);
    });
  });

  describe('when try create address', () => {
    //should create address
    //should not create if property on body request not exists
  });
  describe('when try find address', () => {});
  describe('when try update address', () => {});
  describe('when try remove address', () => {});
});
