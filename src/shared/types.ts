import { Request, Response } from 'express';
import { z, ZodObject, ZodOptional, ZodRawShape } from 'zod';
import { TIdentifiable } from '../models/_base';
import { CRUD } from '../helpers/crud';

export interface IArgs<T extends TIdentifiable = any> {
  body: <T extends ZodObject<ZodRawShape>>(
    model: T | ZodOptional<T>,
  ) => { data: z.infer<T>; success: true } | { data: null; success: false };
  params: Request['params'];
  query: Request['query'];
  res: Response;
  req: Request;
  context: CRUD<T>
}

export type TMethod = 'Get' | 'Post' | 'Put' | 'Delete';

export type TAction = (req: Request, res: Response) => Promise<any>;

export type TRouteAction = [TMethod, string, TAction];

export type TServiceActionResponse<T> = { success: false } | { success: true; data: T };
