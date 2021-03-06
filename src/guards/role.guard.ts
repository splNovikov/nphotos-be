import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserService } from '../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    // https://docs.nestjs.com/guards
    // const request = context.switchToHttp().getRequest();
    // const user = request.user;
    const user = await this.userService.getUser();

    const hasRole = user && user.roles && this.hasRole(user, roles);

    if (!hasRole) {
      Logger.log(`Roles Guard: User doesn't have role: ${roles}`);
    }

    return hasRole;
  }

  private hasRole(user, roles: string[]): boolean {
    return user.roles.some(role => roles.includes(role));
  }
}
