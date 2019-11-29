import { UserPermissions } from './userPermissions';

interface User {
  roles: string[];
  permissions: UserPermissions;
}

export { User };
