import { PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { CreateAddressDto } from '../dto/create-address.dto';

export class FindAddressesInterface extends PartialType(CreateAddressDto) {
  @IsOptional()
  @IsInt()
  id?: number;
}
