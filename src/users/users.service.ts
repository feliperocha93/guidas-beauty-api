import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';
import { Service } from 'typedi';
import * as bcrypt from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';
import {
  getForbiddenErrorMessage,
  getNotEmptyErrorMessage,
  getNotFoundErrorMessage,
  getOnlyAdminErrorMessage,
} from '../constants/error.constants';
import { BODY_REQUEST, USER_ENTITY } from '../constants/fields.constants';
import { UserPayload } from '../interfaces/user-paylod.interface';
import { DELETE, UPDATE } from '../constants/http-verbs.constants';
import { USER_REPOSITORY } from '../constants/database.constants';
@Injectable()
@Service()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await validate(createUserDto);

    try {
      createUserDto.password = await this.getPasswordHash(
        createUserDto.password,
      );
      const { password, role, ...user } = await this.userRepository.save(
        createUserDto,
      );
      return user;
    } catch (error) {
      return error;
    }
  }

  find(filter: FindUserDto) {
    return this.userRepository.find(filter);
  }

  findOne(filter: FindUserDto = {}) {
    return this.userRepository.findOne(filter);
  }

  async update(user: UserPayload, id: number, updateUserDto: UpdateUserDto) {
    const updateUserDtoIsEmpty = Object.keys(updateUserDto).length === 0;
    const userIsOwner = this.checkOwner(user.id, id);
    const userIsAdmin = this.checkAdmin(user.role);
    const userToUpdate = await this.findOne({ id });
    const userToUpdateExists = !!userToUpdate;

    if (updateUserDtoIsEmpty) {
      throw new BadRequestException(getNotEmptyErrorMessage(BODY_REQUEST));
    }

    if (!userToUpdateExists) {
      throw new NotFoundException(getNotFoundErrorMessage(USER_ENTITY.NAME));
    }

    if (updateUserDto.role !== undefined && !userIsAdmin) {
      throw new ForbiddenException(
        getOnlyAdminErrorMessage(UPDATE, USER_ENTITY.ROLE),
      );
    }

    if (!userIsOwner && !userIsAdmin) {
      throw new ForbiddenException(
        getForbiddenErrorMessage(UPDATE, USER_ENTITY.NAME),
      );
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async remove(user: UserPayload, id: number) {
    const userIsOwner = this.checkOwner(user.id, id);
    const userIsAdmin = this.checkAdmin(user.role);
    const userToRemove = await this.findOne({ id });
    const userToRemoveExists = !!userToRemove;

    if (!userToRemoveExists) {
      throw new NotFoundException(getNotFoundErrorMessage(USER_ENTITY.NAME));
    }

    if (!userIsOwner && !userIsAdmin) {
      throw new ForbiddenException(
        getForbiddenErrorMessage(DELETE, USER_ENTITY.NAME),
      );
    }

    return this.userRepository.delete(id);
  }

  private checkOwner(userId: number, id: number) {
    return userId === id;
  }

  private checkAdmin(role: UserRole) {
    return role === UserRole.ADMIN;
  }

  private async getPasswordHash(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
