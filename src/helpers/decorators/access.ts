import { Role } from '../../models/enums/RoleEnum';
import { Globals } from '../../shared/globals';
import { Utils } from '../../shared/utils';
import { AuthService } from '../../services/AuthService';
import { IArgs } from '../../shared/types';

const authService = new AuthService();

export function Access(needRole: keyof typeof Role): MethodDecorator {
  const role = Role[needRole];
  return function (_, __, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (args: IArgs) {
      const {req, res} = args
      const release = () => originalMethod.apply(this, [args]);
      const check = (userRole: Role) =>
        userRole === role ? release() : Utils.error(res, 403);
      const checkPublic = () => check(Role.User);

      if (!req || !res) {
        return release();
      }

      const token = req.cookies[Globals.AUTH_COOKIE];
      if (!token) {
        return checkPublic();
      }

      const user = await authService.getUserByToken(token);
      if (!user) {
        return checkPublic();
      }

      if (user.role === Role.Admin) {
        return release();
      }

      return check(user.role)
    };
  };
}
