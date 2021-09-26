import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { getUniqueErrorMessage } from '../src/constants/error';
import { getConnection, Repository, Connection } from 'typeorm';
import { User, UserRole } from '../src/users/entities/user.entity';

const MAIN_ROUTE = '/users';

const admUser = {
  id: 10000,
  role: UserRole.ADMIN,
  name: 'Margarida Lucena',
  socialName: 'Guida',
  doc: 's2s2s2s2',
  whatsapp: '11999999999',
  password: '$2b$10$JboS87RX73SBXCAYc7zvweMJu0fNsrljwQopxD2DuXrDZZOKowrwu',
};

const userUser = {
  id: 10001,
  role: UserRole.USER,
  name: 'Bartolomeu de Sousa',
  socialName: 'Pompeu',
  doc: 's3s3s3s3',
  whatsapp: '11988888888',
  password: '$2b$10$JboS87RX73SBXCAYc7zvweMJu0fNsrljwQopxD2DuXrDZZOKowrwu',
};

const validUsers = [
  {
    name: 'Felipe',
    socialName: 'Rocha',
    doc: '40259869813',
    whatsapp: '11953762913',
    password: '123456',
  },
];
let validUserIndex = 0;

function addNewValidUser(): void {
  let { doc, whatsapp } = validUsers[validUserIndex];
  doc = (parseInt(doc) + 1).toString();
  whatsapp = (parseInt(whatsapp) + 1).toString();
  validUsers.push({ ...validUsers[validUserIndex], doc, whatsapp });
  validUserIndex++;
}

describe('Users (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let repository: Repository<User>;
  let admToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    //Create and config as app module
    app = moduleFixture.createNestApplication();
    useContainer(app.select(UsersModule), { fallbackOnErrors: true });
    app.useGlobalPipes(
      new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
    );
    await app.init();

    //Prepare the repository
    connection = getConnection();
    repository = connection.getRepository(User);
    repository.clear();
    repository.insert(admUser);
    repository.insert(userUser);

    //Get tokens
    const admLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ whatsapp: admUser.whatsapp, password: admUser.password });
    admToken = admLoginResponse.body.access_token;

    const userLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        whatsapp: userUser.whatsapp,
        password: userUser.password,
      });
    userToken = userLoginResponse.body.access_token;
  });

  afterAll(() => {
    connection.close();
    app.close();
  });

  describe('when try create user', () => {
    it('should create user', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(MAIN_ROUTE)
        .send(validUsers[validUserIndex]);

      expect(status).toBe(201);
      expect(body.name).toBe('Felipe');
    });

    it.each(['name', 'doc', 'whatsapp', 'password'])(
      'should not create without a %s field',
      async (field: string) => {
        addNewValidUser();
        const user = { ...validUsers[validUserIndex], [field]: null };
        const { body, status } = await request(app.getHttpServer())
          .post(MAIN_ROUTE)
          .send(user);

        expect(status).toBe(400);
        expect(body.message[0]).toBe(`${field} should not be empty`);
      },
    );

    it.each(['doc', 'whatsapp'])(
      'should not create if %s already exists',
      async (field: string) => {
        addNewValidUser();
        const user = {
          ...validUsers[validUserIndex],
          [field]: validUsers[0][field],
        };
        const { body, status } = await request(app.getHttpServer())
          .post(MAIN_ROUTE)
          .send(user);

        expect(status).toBe(400);
        expect(body.message[0]).toBe(getUniqueErrorMessage(field));
      },
    );

    it('should create without socialName', async () => {
      addNewValidUser();
      const user = validUsers[validUserIndex];
      delete user.socialName;
      const { body, status } = await request(app.getHttpServer())
        .post(MAIN_ROUTE)
        .send(user);

      expect(status).toBe(201);
      expect(body.socialName).toBeNull();
    });
  });

  describe('when try find users', () => {
    it('should find users if user is adm', async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(MAIN_ROUTE)
        .set('authorization', `bearer ${admToken}`);

      expect(status).toBe(200);
      expect(body.length).toBeGreaterThan(0);
    });

    it('should find users using filter', async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(`${MAIN_ROUTE}?socialName=${admUser.socialName}`)
        .set('authorization', `bearer ${admToken}`);

      expect(status).toBe(200);
      expect(body.length).toBe(1);
    });

    it('should find user by more than one filter if user is adm', async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(
          `${MAIN_ROUTE}?name=${validUsers[0].name}&doc=${validUsers[0].doc}&whatsapp=${validUsers[0].whatsapp}`,
        )
        .set('authorization', `bearer ${admToken}`);

      expect(status).toBe(200);
      expect(body.length).toBe(1);
    });

    it('should not find users if user is not adm', async () => {
      const { status } = await request(app.getHttpServer())
        .get(MAIN_ROUTE)
        .set('authorization', `bearer ${userToken}`);

      expect(status).toBe(403);
    });

    it('should not find user by filter if filter not exists', async () => {
      const fakeFilter = 'fakeFilter';
      const { body, status } = await request(app.getHttpServer())
        .get(`${MAIN_ROUTE}?${fakeFilter}=Orochi`)
        .set('authorization', `bearer ${admToken}`);

      expect(status).toBe(400);
      expect(body.message[0]).toBe(`property ${fakeFilter} should not exist`);
    });
  });

  describe('when try update user', () => {
    it('should update user if user is adm or owner with one field', async () => {});
    it('should update user if user is adm or owner with all fields', async () => {});
    it('should update user role if user is adm', async () => {});

    it('should not update if user is not logged', async () => {});
    it('should not update user if user not exists', async () => {});
    it('should not update user if user not send parameters to update', async () => {});
    it('should not update user if user send parameters not existis', async () => {});
    it('should not update user if user is not adm or owner', async () => {});
    it('should not update user role if user is not adm', async () => {});
  });
  describe('when try remove user', () => {});

  //should remove user if user is adm or owner
  //should not remove user if user not exists
  //should not remove user if user is not adm or owner
  //should not remove user if user not send parameters to remove
  //should not remove user if user send parameters not existis
});
