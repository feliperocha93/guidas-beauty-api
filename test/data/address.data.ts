import { CreateAddressDto } from '../../src/addresses/dto/create-address.dto';

export const addressSP: CreateAddressDto = {
  cep: '09655-000',
  city: 'São Berlondres',
  description: 'A melhor cidade do ABC',
  state: 'SP',
};

export const addressCA: CreateAddressDto = {
  cep: '90015',
  city: 'Los Angeles',
  description: '1111 S Figueroa St',
  state: 'CA',
};
