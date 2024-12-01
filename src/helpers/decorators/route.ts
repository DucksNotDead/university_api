import { Request, Response } from 'express';
import { IArgs, TMethod } from '../../shared/types';
import { Result } from '../result';
import { Globals } from '../../shared/globals';

export function Route(method: TMethod, path?: string): MethodDecorator {
  return function (target, _, descriptor: PropertyDescriptor) {
    const old = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const req: Request = args[0];
      const res: Response = args[1];
      const context = args[2]

      const getBody: IArgs['body'] = (model) => {
        const { success, error, data } = model.safeParse(req.body);
        if (!success) {
          res.status(400).json(new Result({ error }));
          return { success: false, data: null };
        } else {
          return { success: true, data: data as any };
        }
      };

      const newArgs = {
        context,
        res,
        req,
        body: getBody,
        query: req.query,
        params: req.params,
      };

      return old.apply(this, [newArgs]);
    };

    const prototype = target.constructor.prototype;
    if (!prototype[Globals.ROUTE_ACTIONS]) {
      prototype[Globals.ROUTE_ACTIONS] = [];
    }
    prototype[Globals.ROUTE_ACTIONS].push([method, path ?? '', descriptor.value]);
  };
}
