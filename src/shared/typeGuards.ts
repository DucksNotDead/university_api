import { Role } from '../models/enums/RoleEnum';
import { TUser } from '../models/User';
import { JwtPayload } from 'jsonwebtoken';

export const TypeGuards = {
  isRole(role: any): role is Role {
    return Object.values(Role).includes(role);
  },

  isJWTPayload(payload: any): payload is JwtPayload {
    return !!payload.iat
  },

  isUser(user: any): user is TUser {
    return (
      typeof user.id === 'number' &&
      typeof user.login === 'string' &&
      typeof user.name === 'string' &&
      typeof user.surname === 'string' &&
      this.isRole(user.role)
    );
  },
};
