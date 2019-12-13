import { Injectable } from '@nestjs/common';

import { User, UserDTO, UserPermissions } from '../models';
import { isDevelopment } from '../utils/isDevelopment';

@Injectable()
export class UserService {

  public async getUserDTO(): Promise<UserDTO> {
    const user = await this.getUser();

    return { permissions: user.permissions };
  }

  public async getUser(): Promise<User> {
    const isDev = isDevelopment();
    const rolePermissions = isDev
      ? permissionsMap.admin
      : permissionsMap.unauthorized;

    return {
      permissions: rolePermissions.permissions,
      roles: [rolePermissions.role],
    };
  }
}

// todo [after release]: should be somewhere in Mongo
const permissionsMap = {
  unauthorized: {
    role: 'unauthorized',
    permissions: {
      canEditAlbum: false,
    } as UserPermissions,
  },
  admin: {
    role: 'admin',
    permissions: {
      canEditAlbum: true,
    } as UserPermissions,
  },
};
