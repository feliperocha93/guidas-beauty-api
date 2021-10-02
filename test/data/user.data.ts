import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserRole } from '../../src/enums/user-role.enum';
import { User } from '../../src/users/entities/user.entity';

export const admUser: User = {
  id: 10000,
  role: UserRole.ADMIN,
  name: 'Margarida Lucena',
  socialName: 'Guida',
  doc: 's2s2s2s2',
  whatsapp: '11999999999',
  password: '$2b$10$JboS87RX73SBXCAYc7zvweMJu0fNsrljwQopxD2DuXrDZZOKowrwu',
};

export const userUser: User = {
  id: 10001,
  role: UserRole.USER,
  name: 'Bartolomeu de Sousa',
  socialName: 'Pompeu',
  doc: 's3s3s3s3',
  whatsapp: '11988888888',
  password: '$2b$10$JboS87RX73SBXCAYc7zvweMJu0fNsrljwQopxD2DuXrDZZOKowrwu',
};

export const getAdmToken = async (app: INestApplication): Promise<string> => {
  const admLoginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ whatsapp: admUser.whatsapp, password: admUser.password });
  return admLoginResponse.body.access_token;
};

export const getUserToken = async (app: INestApplication): Promise<string> => {
  const userLoginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ whatsapp: userUser.whatsapp, password: userUser.password });
  return userLoginResponse.body.access_token;
};
