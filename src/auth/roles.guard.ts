import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants/auth.constants';
import { UserRole } from '../enums/user-role.enum';
import { removeBearer } from '../helpers/string.helper';
import { UserPayload } from '../interfaces/user-paylod.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const jwtService = new JwtService({
      secret: jwtConstants.secret,
    });

    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;

    const { role } = jwtService.decode(
      removeBearer(bearerToken),
    ) as UserPayload;

    return matchRoles(roles, role);
  }
}
function matchRoles(roles: UserRole[], userRole: UserRole): boolean {
  return roles.includes(userRole);
}
