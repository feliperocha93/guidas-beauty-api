import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';
import { Service } from 'typedi';
import * as bcrypt from 'bcrypt';
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

  findAll() {
    //TODO: Only admin
    return this.userRepository.find();
  }

  findOne(filter = {}) {
    //TODO: Only admin
    return this.userRepository.findOne(filter);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    //TODO: Only admin or user owner
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    //TODO: Only admin or user owner
    return this.userRepository.delete(id);
  }

  private async getPasswordHash(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
