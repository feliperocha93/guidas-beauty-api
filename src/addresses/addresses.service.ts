import { Inject, Injectable } from '@nestjs/common';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { ADDRESS_REPOSITORY } from '../constants/database.constants';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
@Service()
export class AddressesService {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private addressRepository: Repository<Address>,
  ) {}

  create(createAddressDto: CreateAddressDto) {
    try {
      return this.addressRepository.save(createAddressDto);
    } catch (error) {
      return error;
    }
  }

  findAll(filter = {}) {
    return this.addressRepository.find(filter);
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
