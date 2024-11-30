import { TRouteAction } from '../../shared/types';

export function Controller(rootPath: string): ClassDecorator {
  return function ({ prototype }: Function) {
    prototype.routeActions = prototype.routeActions.map(
      ([method, path, action]: TRouteAction) => [method, rootPath + path, action],
    );
  };
}
