import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import {
  getNotEmptyErrorMessage,
  getUniqueErrorMessage,
  getNotFoundErrorMessage,
  getOnlyAdminErrorMessage,
  getForbiddenErrorMessage,
} from '../src/constants/error.constants';
import { getConnection, Repository, Connection } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { UserRole } from '../src/enums/user-role.enum';
import { BODY_REQUEST, USER_ENTITY } from '../src/constants/fields.constants';
import { DELETE, UPDATE } from '../src/constants/http-verbs.constants';

//TODO: Refactor describes to use test template
//TODO: Can not update doc/whatsapp if exists
//TODO: When find/update role, to validate if value exists in enum
//TODO: Add fields length validate

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
    it('should update user if user is adm (one field)', async () => {
      const newName = 'Dona Odete';
      const { status } = await request(app.getHttpServer())
        .patch(`${MAIN_ROUTE}/${userUser.id}`)
        .send({ name: newName })
        .set('authorization', `bearer ${admToken}`);

      const updatedUser = await repository.findOne({ id: userUser.id });

      expect(status).toBe(204);
      expect(updatedUser.name).toBe(newName);
    });

    it('should update user if user is owner (all fields)', async () => {
      const newFields = {
        name: 'Felipe Rocha',
        socialName: 'Tetão',
        doc: '436540794',
        whatsapp: '1139074461',
      };
      const { status } = await request(app.getHttpServer())
        .patch(`${MAIN_ROUTE}/${userUser.id}`)
        .send({ ...newFields })
        .set('authorization', `bearer ${userToken}`);

      const updatedUser = await repository.findOne({ id: userUser.id });

      expect(status).toBe(204);
      expect(updatedUser.name).toBe(newFields.name);
      expect(updatedUser.socialName).toBe(newFields.socialName);
      expect(updatedUser.doc).toBe(newFields.doc);
      expect(updatedUser.whatsapp).toBe(newFields.whatsapp);
    });

    it('should not update user role if user is not adm', async () => {
      const { status } = await request(app.getHttpServer())
        .patch(`${MAIN_ROUTE}/${userUser.id}`)
        .send({ role: UserRole.ADMIN })
        .set('authorization', `bearer ${userToken}`);

      const updatedUser = await repository.findOne({ id: userUser.id });

      expect(status).toBe(403);
      expect(updatedUser.role).toBe(UserRole.USER);
    });

    it('should update user role if user is adm', async () => {
      const { status } = await request(app.getHttpServer())
        .patch(`${MAIN_ROUTE}/${userUser.id}`)
        .send({ role: UserRole.ADMIN })
        .set('authorization', `bearer ${admToken}`);

      const updatedUser = await repository.findOne({ id: userUser.id });

      expect(status).toBe(204);
      expect(updatedUser.role).toBe(UserRole.ADMIN);
    });

    it('should not update if user is not logged', async () => {
      const newName = 'Not Updated';
      const { status } = await request(app.getHttpServer())
        .patch(`${MAIN_ROUTE}/${userUser.id}`)
        .send({ name: newName });

      const updatedUser = await repository.findOne({ id: userUser.id });

      expect(status).toBe(401);
      expect(updatedUser.name).not.toBe(newName);
    });

    it('should not update user if user not exists', async () => {
      const newName = 'Olavo Bilac';
      const { body, status } = await request(app.getHttpServer())
        .patch(`${MAIN_ROUTE}/154651165`)
        .send({ name: newName })
        .set('authorization', `bearer ${admToken}`);

      expect(status).toBe(404);
      expect(body.message).toBe(getNotFoundErrorMessage(USER_ENTITY.NAME));
    });

    it('should not update user if user not send parameters to update', async () => {
      const { body, status } = await request(app.getHttpServer())
        .patch(`${MAIN_ROUTE}/${userUser.id}`)
        .send({})
        .set('authorization', `bearer ${admToken}`);

      expect(status).toBe(400);
      expect(body.message).toBe(getNotEmptyErrorMessage(BODY_REQUEST));
    });

    it('should not update user if user send parameters not existis', async () => {
      const newName = 'Olavo Bilac';
      const { body, status } = await request(app.getHttpServer())
        .patch(`${MAIN_ROUTE}/${userUser.id}`)
        .send({ fakeName: newName })
        .set('authorization', `bearer ${admToken}`);

      expect(status).toBe(400);
      expect(body.message[0]).toBe('property fakeName should not exist');
    });

    it('should not update user if user is not adm or owner', async () => {
      await request(app.getHttpServer())
        .patch(`${MAIN_ROUTE}/${userUser.id}`)
        .send({ role: UserRole.USER })
        .set('authorization', `bearer ${admToken}`);

      const { body, status } = await request(app.getHttpServer())
        .patch(`${MAIN_ROUTE}/${userUser.id}`)
        .send({ role: UserRole.ADMIN })
        .set('authorization', `bearer ${userToken}`);

      expect(status).toBe(403);
      expect(body.message).toBe(
        getOnlyAdminErrorMessage(UPDATE, USER_ENTITY.ROLE),
      );
    });
  });

  describe('when try remove user', () => {
    it('should not remove user if user not exists', async () => {
      const { body, status } = await request(app.getHttpServer())
        .delete(`${MAIN_ROUTE}/10200840`)
        .set('authorization', `bearer ${admToken}`);

      expect(status).toBe(404);
      expect(body.message).toBe(getNotFoundErrorMessage(USER_ENTITY.NAME));
    });

    it('should not remove user if user is not adm or owner', async () => {
      const { body, status } = await request(app.getHttpServer())
        .delete(`${MAIN_ROUTE}/${admUser.id}`)
        .set('authorization', `bearer ${userToken}`);

      expect(status).toBe(403);
      expect(body.message).toBe(
        getForbiddenErrorMessage(DELETE, USER_ENTITY.NAME),
      );
    });

    it('should remove user if user is owner', async () => {
      const { status } = await request(app.getHttpServer())
        .delete(`${MAIN_ROUTE}/${userUser.id}`)
        .set('authorization', `bearer ${userToken}`);

      const deletedUser = await repository.findOne({ id: userUser.id });

      expect(status).toBe(204);
      expect(deletedUser).toBeUndefined();
    });

    it('should remove user if user is adm', async () => {
      await repository.insert(userUser);

      const { status } = await request(app.getHttpServer())
        .delete(`${MAIN_ROUTE}/${userUser.id}`)
        .set('authorization', `bearer ${admToken}`);

      const deletedUser = await repository.findOne({ id: userUser.id });

      expect(status).toBe(204);
      expect(deletedUser).toBeUndefined();
    });
  });
});
