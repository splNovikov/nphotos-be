import { UserPermissions } from './userPermissions';

interface User {
  roles: string[];
  permissions: UserPermissions;
}

class UserDTO {
  readonly permissions: UserPermissions;
}

export { User, UserDTO };
