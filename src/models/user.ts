import { UserPermissions } from './userPermissions';

interface User {
  roles: string[];
  permissions: UserPermissions;
}

// todo: fox all DTOs and move DTOs to separate files
class UserDTO {
  readonly permissions: UserPermissions;
}

export { User, UserDTO };
