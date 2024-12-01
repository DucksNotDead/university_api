import { Request, Response } from 'express';
import { Role } from '../../models/enums/RoleEnum';
import { Utils } from '../../shared/utils';
import { Globals } from '../../shared/globals';
import { AuthService } from '../../services/AuthService';
import { TRouteAction } from '../../shared/types';

const authService = new AuthService();

export function Controller(
  rootPath: string,
  needRole: keyof typeof Role,
): ClassDecorator {
  const role = Role[needRole];
  return function ({ prototype }: Function) {
    prototype[Globals.ROUTE_ACTIONS] = prototype[Globals.ROUTE_ACTIONS].map(([method, path, action]: TRouteAction) => {
      const old = action as any;
      action = async function (...args: any[]) {
        const req: Request = args[0];
        const res: Response = args[1];
        const release = () =>
          old.apply(null, [req, res, prototype.constructor()]);
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

        const user = await authService.getUserByToken(res, token);
        if (!user.success) {
          return checkPublic();
        }

        if (user.data.role === Role.Admin) {
          return release();
        }

        return check(user.data.role);
      };

      return [method, rootPath + path, action];
    });
  };
}
