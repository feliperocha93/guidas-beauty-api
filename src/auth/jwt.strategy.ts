import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants/auth.constants';
import { User } from '../users/entities/user.entity';
import { UserPayload } from '../../src/interfaces/user-paylod.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: User): Promise<UserPayload> {
    return { id: payload.id, role: payload.role, whatsapp: payload.whatsapp };
  }
}
