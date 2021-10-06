import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from '../dto/create-address.dto';

export class FindAddressesInterface extends PartialType(CreateAddressDto) {}
