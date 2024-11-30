import { Request, Response } from 'express';
import { IArgs, TMethod } from '../../shared/types';

export function Route(method: TMethod, path?: string): MethodDecorator {
  return function (target, _, descriptor: PropertyDescriptor) {
    const old = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const req: Request = args[0];
      const res: Response = args[1];

      const getBody: IArgs['body'] = (model) => {
        const { success, error } = model.safeParse(req.body);
        if (!success) {
          res.status(400).json(error);
          return null;
        } else {
          return req.body;
        }
      };

      const newArgs: IArgs = {
        res,
        req,
        body: getBody,
        query: req.query,
      };

      return old.apply(this, [newArgs]);
    };

    const prototype = target.constructor.prototype;
    if (!prototype.routeActions) {
      prototype.routeActions = [];
    }
    prototype.routeActions.push([method, path ?? '', descriptor.value]);
  };
}
