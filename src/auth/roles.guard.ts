import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants/auth';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    //TODO:To use with dependency injeciton
    const jwtService = new JwtService({
      secret: jwtConstants.secret,
    });

    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;

    //TODO: Create a helper to extrac token
    const { role } = jwtService.decode(bearerToken.split(' ')[1]) as {
      id: number;
      role: UserRole;
      whatsapp: string;
    };

    return matchRoles(roles, role);
  }
}
function matchRoles(roles: UserRole[], userRole: UserRole): boolean {
  return roles.includes(userRole);
}
