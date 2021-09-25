import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { getUniqueErrorMessage } from '../src/constants/error';
import { getRepository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';

const MAIN_ROUTE = '/users';
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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(UsersModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const repository = getRepository(User);
    repository.clear();
  });

  afterAll(() => {
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

  describe('when try find all users', () => {
    it('should find all users if user is adm', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(MAIN_ROUTE)
        .send(validUsers[validUserIndex]);

      expect(status).toBe(201);
      expect(body.name).toBe('Felipe');
    });

    it('shouldnot find all users if user is not adm', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(MAIN_ROUTE)
        .send(validUsers[validUserIndex]);

      expect(status).toBe(201);
      expect(body.name).toBe('Felipe');
    });
  });

  describe('when try find user', () => {});
  describe('when try update user', () => {});
  describe('when try remove user', () => {});

  //should find user by filter if user is adm
  //should find user by more then one filter if user is adm
  //should't find user by filter if not exists filter
  //should't find user by filter if filter not exists
  //shouldn't find user by filter if user isn't adm

  //should update user if user is adm or owner with one field
  //should update user if user is adm or owner with all fields
  //should't update user if user not exists
  //should't update user if user not send parameters to update
  //should't update user if user send parameters not existis
  //should't update user if user is not adm or owner
  //should't update user role if user is adm
  //should't update user role if user is not adm

  //should remove user if user is adm or owner
  //should't remove user if user not exists
  //should't remove user if user is not adm or owner
  //should't remove user if user not send parameters to remove
  //should't remove user if user send parameters not existis
});
