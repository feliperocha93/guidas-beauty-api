import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginResponse } from '../interfaces/login-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(whatsapp: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOne({ whatsapp });
    if (user && bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  login(user: User): LoginResponse {
    const payload = { whatsapp: user.whatsapp, id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
