import { Request, Response } from 'express';
import { z, ZodObject, ZodRawShape } from 'zod';

export interface IArgs {
  body: <T extends ZodRawShape>(model: ZodObject<T>) => z.infer<ZodObject<T>> | null;
  query: Request['query'];
  res: Response;
  req: Request;
}

export type TMethod = 'Get' | 'Post' | 'Put' | 'Delete';

export type TAction = (req: Request, res: Response) => Promise<any>;

export type TRouteAction = [TMethod, string, TAction];
