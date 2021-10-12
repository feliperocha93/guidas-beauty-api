import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { ADDRESS_REPOSITORY } from '../constants/database.constants';
import {
  getNotEmptyErrorMessage,
  getNotFoundErrorMessage,
  getNotNullValuesErrorMessage,
} from '../constants/error.constants';
import { ADDRESS_ENTITY, BODY_REQUEST } from '../constants/fields.constants';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { FindAddressesInterface } from './interfaces/find-addresses.interface';

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

  find(filter: FindAddressesInterface = {}) {
    return this.addressRepository.find(filter);
  }

  findOne(filter: FindAddressesInterface = {}) {
    return this.addressRepository.findOne(filter);
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const payloadIsEmpty = Object.keys(updateAddressDto).length === 0;
    const payloadHasNullValue = Object.values(updateAddressDto).includes(null);
    const addressToUpdate = await this.findOne({ id });
    const addressToUpdateExists = !!addressToUpdate;

    if (payloadIsEmpty) {
      throw new BadRequestException(getNotEmptyErrorMessage(BODY_REQUEST));
    }

    if (payloadHasNullValue) {
      throw new BadRequestException(getNotNullValuesErrorMessage());
    }

    if (!addressToUpdateExists) {
      throw new NotFoundException(getNotFoundErrorMessage(ADDRESS_ENTITY.NAME));
    }

    return this.addressRepository.update(id, updateAddressDto);
  }

  async remove(id: number) {
    const addressToRemove = await this.findOne({ id });
    const addressToRemoveExists = !!addressToRemove;

    if (!addressToRemoveExists) {
      throw new NotFoundException(getNotFoundErrorMessage(ADDRESS_ENTITY.NAME));
    }

    return this.addressRepository.delete(id);
  }
}
