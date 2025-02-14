import { Response } from 'express';
import { Errors } from './errors';
import { TFilters } from '../models/FiltersAndPagination';
import { Result } from './helpers/result';
import { Globals } from './globals';

export const Utils = {
  toQuoteless(str: string): string {
    return str.replace(/'/g, '');
  },
  success(res: Response, data: any) {
    return res
      .status(200)
      .json(new Result({ data, role: (res as any)[Globals.ROLE_INFO] }));
  },
  error(res: Response, status: keyof typeof Errors, message?: string) {
    return res.status(status).json(
      new Result({
        error: {
          code: status,
          text: `${Errors[status]}${message ? `. ${message}` : ''}`,
        },
      }),
    );
  },
  parseFilters<T extends TFilters['filters']>(
    filters: T,
    searchProps?: string[],
  ): string {
    const result: string[] = [];
    for (const param in filters) {
      if (param === 'search') {
        if (searchProps && searchProps.length) {
          result.push(
            searchProps
              .map((prop) => `${prop} ~* '${this.toQuoteless(filters[param] as string)}'`)
              .join(' or '),
          );
        }
      } else {
        if (typeof filters[param] === 'string') {
          result.push(`${param} ~* '${filters[param]}'`);
        } else if (typeof filters[param] === 'number') {
          result.push(`${param} = ${filters[param]}`);
        }
      }
    }
    return result.join(' and ');
  },
};
