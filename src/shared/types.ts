import { Request, Response } from 'express';
import { z, ZodObject, ZodOptional, ZodRawShape } from 'zod';
import { TIdentifiable } from '../models/_base';
import { TUser } from '../models/User';
import { Role } from '../models/enums/RoleEnum';

export interface IScope {
  joins?: [string, string, string][]; //table_name as tn on tn.prop = ... -> ['table_name', 'tn', 'tn.prop = ...']
  where?: string; //main.prop = tn.prop
}

export interface IArgs<T extends TIdentifiable = any> {
  body: <T extends ZodObject<ZodRawShape>>(
    model: T | ZodOptional<T>,
  ) => { data: z.infer<T>; success: true } | { data: null; success: false };
  params: Request['params'];
  query: Request['query'];
  res: Response;
  req: Request;
  user: TUser | null;
}

export type TMethod = 'Get' | 'Post' | 'Put' | 'Delete';

export type TScopeFn = (args: IArgs) => IScope;

export type TScopeFilterFn = (args: IArgs) => { prop: string; scope: IScope };

export interface IRouteInfo {
  method: TMethod;
  path: string;
  isPublic: boolean;
  role?: keyof typeof Role;
  context?: object;
}

export type TServiceActionResponse<T> = { success: false } | { success: true; data: T };
