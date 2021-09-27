import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';
import { Service } from 'typedi';
import * as bcrypt from 'bcrypt';
import { FindUserInterface } from './interfaces/find-user.interface';
@Injectable()
@Service()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
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

  find(filter: FindUserInterface) {
    return this.userRepository.find(filter);
  }

  findOne(filter: FindUserInterface = {}) {
    return this.userRepository.findOne(filter);
  }

  //TODO: Implements interface as jwt-strategy
  async update(user: any, id: number, updateUserDto: UpdateUserDto) {
    const updateUserDtoIsEmpty = Object.keys(updateUserDto).length === 0;
    const userIsOwner = this.checkOwner(user.id, id);
    const userIsAdmin = this.checkAdmin(user.role);
    const userToUpdate = await this.findOne({ id });
    const userToUpdateExists = !!userToUpdate;

    //TODO: create a exception message file in constants folder
    if (updateUserDtoIsEmpty) {
      throw new BadRequestException('body request can not be empty');
    }

    if (!userToUpdateExists) {
      throw new NotFoundException('user not found');
    }

    if (updateUserDto.role !== undefined && !userIsAdmin) {
      throw new ForbiddenException('only admin can update role');
    }

    if (!userIsOwner && !userIsAdmin) {
      throw new ForbiddenException('can not update this user');
    }

    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  private checkOwner(userId: number, id: number) {
    //TODO: Implements interface as jwt-strategy
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
