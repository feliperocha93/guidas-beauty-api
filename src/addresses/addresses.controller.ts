import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ROUTES } from '../constants/routes.constants';
import { UserRole } from '../enums/user-role.enum';
import { RequestErrorInterface } from '../interfaces/request-errors.interface';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { FindAddressesInterface } from './interfaces/find-addresses.interface';
import { Address } from './entities/address.entity';

@ApiTags(`Addresses`)
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: RequestErrorInterface,
})
@Controller(ROUTES.ADDRESSES)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create new address',
    description: `<h3>Create a new address.</h3>
    <b>Rules:</b><br>
    Only admin can use this route.`,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: `Field should not be empty. <br>
       Some property not exists <br>
       Field type validation <br>`,
    type: RequestErrorInterface,
  })
  @ApiForbiddenResponse({
    description: `Forbbiden by role <br>
    Credentials are not administrator's or user's own`,
    type: RequestErrorInterface,
  })
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find addresses by filters',
    description: `<h3>Find addresses by filters.</h3>`,
  })
  @ApiOkResponse({
    description: 'The addresses has been successfully found.',
    type: Address,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Some filter not exists',
    type: RequestErrorInterface,
  })
  @UseGuards(JwtAuthGuard)
  find(@Query() query: FindAddressesInterface) {
    return this.addressesService.find({ ...query });
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update address by id',
    description: `<h3>Update address by id.</h3>`,
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: `Payload should not be empty <br>
      Field should not be empty. <br>
      Some property not exists <br>
      Field type validation <br>`,
    type: RequestErrorInterface,
  })
  @ApiForbiddenResponse({
    description: `Forbbiden by role <br>
    Credentials are not administrator's or user's own`,
    type: RequestErrorInterface,
  })
  @ApiNotFoundResponse({
    description: 'Address not exist',
    type: RequestErrorInterface,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(+id, updateAddressDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove address by id',
    description: `<h3>Remove address by id.</h3>`,
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully removed.',
  })
  @ApiForbiddenResponse({
    description: `Forbbiden by role <br>
    Credentials are not administrator's or user's own`,
    type: RequestErrorInterface,
  })
  @ApiNotFoundResponse({
    description: 'Address not exist',
    type: RequestErrorInterface,
  })
  remove(@Param('id') id: string) {
    return this.addressesService.remove(+id);
  }

  @Get('/state')
  @ApiOperation({
    summary: 'Get list of avaliable states',
    description: `<h3>Return a list of avaliable states from adressess createds in database</h3>`,
  })
  @ApiOkResponse({
    type: String,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  getStates() {
    return this.addressesService.getStates();
  }

  @Get('/city')
  @ApiOperation({
    summary: 'Get list of avaliable cities',
    description: `<h3>Return a list of avaliable cities from adressess createds in database</h3>`,
  })
  @ApiOkResponse({
    type: String,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  getCities() {
    return this.addressesService.getCities();
  }

  @Get('/cep')
  @ApiOperation({
    summary: 'Get list of avaliable ceps',
    description: `<h3>Return a list of avaliable ceps from adressess createds in database</h3>`,
  })
  @ApiOkResponse({
    type: String,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  getCeps() {
    return this.addressesService.getCeps();
  }
}
