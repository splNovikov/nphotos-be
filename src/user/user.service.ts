import { Injectable } from '@nestjs/common';

import { UserDTO } from '../models/user';
import { UserPermissions } from '../models/userPermissions';
import { isDevelopment } from '../utils/isDevelopment';

@Injectable()
export class UserService {

  async getUser(): Promise<UserDTO> {
    const permissions = this.fakeUserPermissionsAssignment(isDevelopment());

    return new UserDTO(permissions);
  }

  private fakeUserPermissionsAssignment(isDev: boolean): UserPermissions {
    return isDev
      ? {canEditAlbum: true}
      : {canEditAlbum: false};
  }
}
