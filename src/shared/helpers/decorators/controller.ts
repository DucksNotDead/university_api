import { Express, Request, Response, Router } from 'express';
import { Role } from '../../../models/enums/RoleEnum';
import { AuthService } from '../../../services/AuthService';
import { Globals } from '../../globals';
import { Utils } from '../../utils';
import { IArgs, IRouteInfo, TMethod } from '../../types';
import { CRUD, ICrudProps } from '../crud';
import { TIdentifiable } from '../../../models/_base';

const authService = new AuthService();

export function Controller<T extends TIdentifiable>(
  rootPath: string,
  needRole: keyof typeof Role,
  crudProps?: ICrudProps<T>,
) {
  return function (constructor: any) {
    const proto = constructor.prototype;
    const controllerRouter = Router();

    if (crudProps) {
      const crud = new CRUD(crudProps);

      const crudRoutes: Partial<Record<keyof typeof crud, TMethod>> = {
        getAll: 'Get',
        getItem: 'Get',
        create: 'Post',
        update: 'Put',
        delete: 'Delete',
      } as const;

      for (const actionName in crudRoutes) {
        const method = crudRoutes[actionName as keyof typeof crud];
        if (proto[actionName] && proto[actionName][Globals.ROUTE_INFO]) {
          continue;
        }
        proto[actionName] = crud[actionName as keyof typeof crud];
        proto[actionName][Globals.ROUTE_INFO] = {
          method: method,
          path: `/${actionName === 'getItem' || actionName === 'delete' ? ':id' : method === 'Post' ? 'create' : ''}`,
          isPublic: Globals.IS_ALL_GET_PUBLIC && method === 'Get',
          context: crud,
        } as IRouteInfo;
      }
    }

    const instance = new constructor();

    console.log(rootPath, needRole);
    for (const key of Object.getOwnPropertyNames(proto)) {
      const routeInfo: IRouteInfo =
        instance[key as keyof typeof instance]?.[Globals.ROUTE_INFO];

      if (routeInfo) {
        (controllerRouter as any)[routeInfo.method.toLowerCase()](
          routeInfo.path,
          async (req: Request, res: Response) => {
            const user = await authService.getUserByToken(
              req.cookies[Globals.AUTH_COOKIE],
            );

            const isAdmin = user.success && user.data.role === Role.Admin;

            if (!routeInfo.isPublic) {
              if (
                !isAdmin &&
                !(user.success && user.data.role !== (routeInfo.role ?? needRole))
              ) {
                return Utils.error(res, 403);
              }
            }

            const { body, params, query } = req;

            (res as any)[Globals.ROLE_INFO] = routeInfo.role ?? needRole

            const getBody: IArgs['body'] = (model) => {
              const { success, error, data } = model.safeParse(body);
              if (!success) {
                res.status(400).json({ error });
                return { success: false, data: null };
              } else {
                return { success: true, data: data as any };
              }
            };

            const args: IArgs = {
              req,
              res,
              params,
              query,
              user: user.success ? user.data : null,
              body: getBody,
            };

            await (routeInfo.context ?? instance)[key](args);
          },
        );
        console.log([routeInfo.method, routeInfo.path, `public: ${routeInfo.isPublic}`]);
      }
    }

    proto.init = function (app: Express) {
      app.use(rootPath, controllerRouter);
    };
  };
}
