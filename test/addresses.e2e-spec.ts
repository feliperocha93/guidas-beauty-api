import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getConnection, Repository, Connection } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { AddressesModule } from '../src/addresses/addresses.module';
import { admUser, getAdmToken, getUserToken, userUser } from './data/user.data';
import { ROUTES } from '../src/constants/routes.constants';
import { configApp, getApp } from './config/test-init';
import { addressCA, addressSP } from './data/address.data';
import { Address } from '../src/addresses/entities/address.entity';

const MAIN_ROUTE = `/${ROUTES.ADDRESSES}`;

describe('Addresses (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let addressRepository: Repository<Address>;
  let userReposiroty: Repository<User>;
  let admToken: string;
  let userToken: string;

  /**
   * @description
   *  Each one insert will add two addresses in repository (addressSP and addressCA)
   */
  const configRepository = (
    repository: Repository<Address>,
    insertsNumber: number,
  ): void => {
    repository.clear();
    for (let i = 0; i < insertsNumber; i++) {
      repository.insert(addressSP);
      repository.insert(addressCA);
    }
  };

  beforeAll(async () => {
    app = await getApp();
    await configApp(app, AddressesModule);
    await app.init();

    // Insert test users
    connection = getConnection();
    addressRepository = connection.getRepository(Address);
    userReposiroty = connection.getRepository(User);
    userReposiroty.clear();
    userReposiroty.insert(admUser);
    userReposiroty.insert(userUser);

    //Get tokens
    admToken = await getAdmToken(app);
    userToken = await getUserToken(app);
  });

  afterAll(async () => {
    connection.close();
    app.close();
  });

  describe('when try create address', () => {
    it('should create address', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(MAIN_ROUTE)
        .send(addressCA)
        .set('authorization', `bearer ${admToken}`);

      expect(status).toBe(201);
      expect(body.cep).toBe(addressCA.cep);
      expect(body.city).toBe(addressCA.city);
      expect(body.description).toBe(addressCA.description);
      expect(body.state).toBe(addressCA.state);
    });

    it('should not create with user credentials', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(MAIN_ROUTE)
        .send(addressCA)
        .set('authorization', `bearer ${userToken}`);

      expect(status).toBe(403);
      expect(body.message).toBe('Forbidden resource');
    });

    it('should not create id admin is not logged', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(MAIN_ROUTE)
        .send(addressCA);

      expect(status).toBe(401);
      expect(body.message).toBe('Unauthorized');
    });

    it.each(['description', 'cep', 'city', 'state'])(
      'should not create without a %s field',
      async (field: string) => {
        const localAddress = { ...addressCA, [field]: null };
        const { body, status } = await request(app.getHttpServer())
          .post(MAIN_ROUTE)
          .send(localAddress)
          .set('authorization', `bearer ${admToken}`);

        expect(status).toBe(400);
        expect(body.message[0]).toBe(`${field} should not be empty`);
      },
    );

    it.each(['description', 'cep', 'city', 'state'])(
      'should not create if %s is empty',
      async (field: string) => {
        const localAddress = { ...addressSP, [field]: '' };
        const { body, status } = await request(app.getHttpServer())
          .post(MAIN_ROUTE)
          .send(localAddress)
          .set('authorization', `bearer ${admToken}`);

        expect(status).toBe(400);
        expect(body.message[0]).toBe(`${field} should not be empty`);
      },
    );

    it.each(['description', 'cep', 'city', 'state'])(
      'should not create if %s is not string',
      async (field: string) => {
        const localAddress = { ...addressCA, [field]: 5 };
        const { body, status } = await request(app.getHttpServer())
          .post(MAIN_ROUTE)
          .send(localAddress)
          .set('authorization', `bearer ${admToken}`);

        expect(status).toBe(400);
        expect(body.message[0]).toBe(`${field} must be a string`);
      },
    );

    it('should not create if fields not exists', async () => {
      const FAKE_FIELD = 'fakeField';
      const localAddress = { ...addressSP, [FAKE_FIELD]: 'Fake value' };
      const { body, status } = await request(app.getHttpServer())
        .post(MAIN_ROUTE)
        .send(localAddress)
        .set('authorization', `bearer ${admToken}`);

      expect(status).toBe(400);
      expect(body.message[0]).toBe(`property ${FAKE_FIELD} should not exist`);
    });
  });

  describe('when try find address', () => {
    const TOTAL_ADDRESSES = 3;
    const FIND_ADDRESSES_FIELDS = Object.getOwnPropertyNames(addressSP);
    beforeAll(() => {
      configRepository(addressRepository, TOTAL_ADDRESSES);
    });

    it('should find all without parameters', async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(MAIN_ROUTE)
        .query({})
        .set('authorization', `bearer ${userToken}`);

      expect(status).toBe(200);
      expect(body.length).toBe(TOTAL_ADDRESSES * 2);
    });

    it.each(FIND_ADDRESSES_FIELDS)(
      'should find with only %s parameter',
      async (field: string) => {
        const { body, status } = await request(app.getHttpServer())
          .get(MAIN_ROUTE)
          .query({ [field]: addressCA[field] })
          .set('authorization', `bearer ${userToken}`);

        expect(status).toBe(200);
        expect(body.length).toBe(3);
      },
    );

    it.each([
      FIND_ADDRESSES_FIELDS.slice(0, 2),
      FIND_ADDRESSES_FIELDS.slice(-2),
    ])(
      'should find with some parameters (%s, %s)',
      async (fieldOne: string, fieldTwo: string) => {
        const { body, status } = await request(app.getHttpServer())
          .get(MAIN_ROUTE)
          .query({
            [fieldOne]: addressSP[fieldOne],
            [fieldTwo]: addressSP[fieldTwo],
          })
          .set('authorization', `bearer ${userToken}`);

        expect(status).toBe(200);
        expect(body.length).toBe(3);
      },
    );

    it('should find with all parameters', async () => {
      const query = {
        ...addressSP,
      } as Address;

      delete query.id;
      const { body, status } = await request(app.getHttpServer())
        .get(MAIN_ROUTE)
        .query(query)
        .set('authorization', `bearer ${userToken}`);

      expect(status).toBe(200);
      expect(body.length).toBe(3);
    });

    it.each(FIND_ADDRESSES_FIELDS)(
      'should find nothing with wrong values',
      async (field: string) => {
        const query = {
          ...addressSP,
          [field]: addressCA[field],
        } as Address;

        delete query.id;

        const { body, status } = await request(app.getHttpServer())
          .get(MAIN_ROUTE)
          .query(query)
          .set('authorization', `bearer ${userToken}`);

        expect(status).toBe(200);
        expect(body.length).toBe(0);
      },
    );

    it('should not find if user is not logged', async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(MAIN_ROUTE)
        .query({ ...addressCA });

      expect(status).toBe(401);
      expect(body.message).toBe('Unauthorized');
    });

    it('should not find if parametes not exist', async () => {
      const FAKE_FIELD = 'fakeField';
      const { body, status } = await request(app.getHttpServer())
        .get(MAIN_ROUTE)
        .query({ [FAKE_FIELD]: 'fake value' })
        .set('authorization', `bearer ${userToken}`);

      expect(status).toBe(400);
      expect(body.message[0]).toBe(`property ${FAKE_FIELD} should not exist`);
    });
  });
  // describe('when try update address', () => {});
  // describe('when try remove address', () => {});
  // describe('when try get lists', () => {});
});
