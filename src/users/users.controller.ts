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
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../enums/user-role.enum';
import { FindUserDto } from './dto/find-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { RequestErrorInterface } from '../interfaces/request-errors.interface';

@ApiTags('Users Controller')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: RequestErrorInterface,
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //TODO: Move create route to controller
  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: `<h3>Create a new user.</h3>
    <b>Rules:</b><br>
    By default, the new user role is 'user'. <br>
    To set user role as 'admin', you can do it using a admin user credentials.`,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: `Field should not be empty. <br>
       Doc and Whatsapp field must be unique in database <br>
       Some property not exists`,
    type: RequestErrorInterface,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find users by filters',
    description: `<h3>Find users by filters.</h3>
    <b>Rules:</b><br>
    It's required at least one filter. <br>
    Only admin can use this route`,
  })
  @ApiOkResponse({
    description: 'The users has been successfully found.',
    type: User,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Some filter not exists',
    type: RequestErrorInterface,
  })
  @ApiForbiddenResponse({
    description: `Forbbiden by role <br>
    Credentials are not administrator's or user's own`,
    type: RequestErrorInterface,
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  find(@Query() query: FindUserDto) {
    return this.usersService.find({ ...query });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: `<h3>Update user by id.</h3>
    <b>Rules:</b><br>
    It's required at least one param to update. <br>
    Only admin can update user role. <br>
    Only admin or user itself can update it.`,
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: `Body request is empty <br>
    Some property not exists <br>`,
    type: RequestErrorInterface,
  })
  @ApiForbiddenResponse({
    description: `Credentials is not of user admin or user itself`,
    type: RequestErrorInterface,
  })
  @ApiNotFoundResponse({
    description: 'User not exists',
    type: RequestErrorInterface,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user, +id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: `<h3>Delete user.</h3>
    <b>Rules:</b><br>
    Only admin or user itself can delete it.`,
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiForbiddenResponse({
    description: `Credentials is not of user admin or user itself`,
    type: RequestErrorInterface,
  })
  @ApiNotFoundResponse({
    description: 'User not exists',
    type: RequestErrorInterface,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  remove(@Req() req, @Param('id') id: string) {
    return this.usersService.remove(req.user, +id);
  }
}
