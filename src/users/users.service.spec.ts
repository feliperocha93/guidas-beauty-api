import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { userProviders } from './user.providers';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../app.module';

const MAIN_ROUTE = '/users';
const validUser = {
  name: 'Felipe',
  socialName: 'Rocha',
  doc: '40259869813',
  whatsapp: '9898989898',
  password: '12345',
};

describe('UsersService', () => {
  let service;
  let app;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [AppModule, DatabaseModule],
      providers: [...userProviders, UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('when try create user', () => {
    it('should create user', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(MAIN_ROUTE)
        .send(validUser);

      expect(status).toBe(201);
      expect(body.name).toBe('Felipe');
    });

    it.each(['name', 'doc', 'whatsapp', 'password'])(
      'should not create without a %s field',
      async (field: string) => {
        const user = { ...validUser, [field]: null };
        console.log(user);
        const { body, status } = await request(app.getHttpServer())
          .get(MAIN_ROUTE)
          .send(user);

        expect(status).toBe(400);
        expect(body.error).toBe(`${field} is required`);
      },
    );

    it('should create without socialName', async () => {
      const user = validUser;
      delete user.socialName;
      const { body, status } = await request(app.getHttpServer())
        .get(MAIN_ROUTE)
        .send(user);

      expect(status).toBe(200);
      expect(body.socialName).toBeUndefined();
    });
  });
});
