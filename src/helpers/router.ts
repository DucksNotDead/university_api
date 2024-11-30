import { Express } from 'express';
import { TRouteAction } from '../shared/types';

export class Router {
  private routeActions: TRouteAction[] = [];

  constructor(...controllers: any[]) {
    for (const controller of controllers) {
      if (controller.prototype.routeActions) {
        this.routeActions.push(...controller.prototype.routeActions);
      }
    }
  }

  init(app: Express) {
    for (const [method, path, action] of this.routeActions) {
      app[method.toLowerCase() as keyof Express](path, action);
    }
  }
}
