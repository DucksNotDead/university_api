import { Express } from 'express';
import { TRouteAction } from '../shared/types';
import { Globals } from '../shared/globals';

export class Router {
  private routeActions: TRouteAction[] = [];

  constructor(...controllers: any[]) {
    for (const controller of controllers) {
      if (controller.prototype[Globals.ROUTE_ACTIONS]) {
        this.routeActions.push(...new controller()[Globals.ROUTE_ACTIONS]);
      }
    }

    console.log(this.routeActions.map(([m, p]) => [m, p]));
  }

  init(app: Express) {
    for (const [method, path, action] of this.routeActions) {
      app[method.toLowerCase() as keyof Express](path, action);
    }
  }
}
