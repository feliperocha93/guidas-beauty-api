import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class UpdateAddressDto extends PartialType(CreateUserDto) {}
