import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
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
}
