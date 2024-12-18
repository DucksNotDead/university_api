import { IRouteInfo, TMethod } from '../../types';
import { Role } from '../../../models/enums/RoleEnum';
import { Globals } from '../../globals';

export function Route(
  method: TMethod,
  path: string,
  options?: { isPublic?: boolean; role?: keyof typeof Role },
): MethodDecorator {
  return function (_, __, descriptor: PropertyDescriptor) {
    descriptor.value[Globals.ROUTE_INFO] = {
      method,
      path,
      isPublic: !!options?.isPublic,
      role: options?.role,
    } as IRouteInfo;

    return descriptor;
  };
}
