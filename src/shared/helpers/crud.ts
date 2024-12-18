import { IArgs, IScope, TScopeFilterFn, TScopeFn, TServiceActionResponse } from '../types';
import { FiltersAndPagination, TFiltersAndPagination } from '../../models/FiltersAndPagination';
import { Utils } from '../utils';
import { z } from 'zod';
import { Repository } from './repository';
import { TIdentifiable } from '../../models/_base';
import { Response } from 'express';

export interface ICrudProps<T extends TIdentifiable> {
  repository: Repository<T>;
  get?: { searchBy?: (keyof T)[] | null; scopeFilterFn?: TScopeFilterFn } | null;
  create?: {
    dto: z.infer<any>;
    findSameBy?: string | null;
  } | null;
  update?: { dto: z.infer<any>; scopeFn?: TScopeFn } | null;
  delete?: { where?: string } | null;
}

export class CRUD<T extends TIdentifiable> {
  repository: Repository<T> | null = null;
  getProps?: ICrudProps<T>['get'];
  createProps?: ICrudProps<T>['create'];
  updateProps?: ICrudProps<T>['update'];
  deleteProps?: ICrudProps<T>['delete'];

  constructor(properties: ICrudProps<T>) {
    this.repository = properties.repository;
    this.getProps = properties.get;
    this.createProps = properties.create;
    this.updateProps = properties.update;
    this.deleteProps = properties.delete;
  }

  async getAll(args: IArgs<T>) {
    if (this.getProps !== null) {
      const { res, body } = args;
      try {
        const { success, data: filtersAndPagination } = body(FiltersAndPagination);
        if (!success) {
          return Utils.error(res, 400, 'filter or pagination error');
        }

        const entities = await this.serviceGetAll(args, filtersAndPagination);
        if (!entities.success) {
          return Utils.error(res, 500, 'repo error');
        }

        return Utils.success(res, entities.data);
      } catch (err) {
        return Utils.error(res, 500, 'server error');
      }
    }
  }

  async create({ res, body }: IArgs) {
    if (this.createProps) {
      try {
        const { success, data: dto } = body(this.createProps.dto);
        if (!success) {
          return;
        }

        const result = await this.serviceCreate(res, dto);
        if (!result.success) {
          return;
        }

        return Utils.success(res, result.data);
      } catch (err) {
        return Utils.error(res, 500);
      }
    }
  }

  async update(args: IArgs) {
    if (this.updateProps) {
      const { res, body } = args;
      try {
        const { success, data: dto } = body(this.updateProps.dto);
        if (!success) {
          return;
        }

        const result = await this.serviceUpdate(args, dto);
        if (!result.success) {
          return;
        }

        return Utils.success(res, result.data);
      } catch (err) {
        return Utils.error(res, 500);
      }
    }
  }

  async delete({ res, params }: IArgs) {
    if (this.deleteProps !== null) {
      try {
        const id = Number(params.id);

        const result = await this.serviceDelete(id);
        if (!result) {
          return Utils.error(res, 404);
        }
        return Utils.success(res, id);
      } catch (err) {
        return Utils.error(res, 500);
      }
    }
  }

  private async serviceGetAll(
    args: IArgs,
    filtersAndPagination: TFiltersAndPagination,
  ): Promise<TServiceActionResponse<T[]>> {
    const { filters, pagination } = filtersAndPagination!;

    const where = Utils.parseFilters(
      filters,
      this.getProps?.searchBy !== null
        ? ((this.getProps?.searchBy as string[]) ?? ['name'])
        : undefined,
    );

    let queryScope: IScope = {}
    const scopeFilter = this.getProps?.scopeFilterFn?.(args)
    if (scopeFilter) {
      const {scope, prop} = scopeFilter
      if (filters?.[prop] === true) {
        queryScope = scope
      }
    }

    await this.repository?.startSession();
    const entities = await this.repository?.getAll({
      where,
      ...pagination,
      ...queryScope,
    });
    this.repository?.endSession();

    if (!entities) {
      Utils.error(args.res, 500);
      return { success: false };
    }

    return { success: true, data: entities };
  }

  private async serviceCreate(
    res: Response,
    item: z.infer<any>,
  ): Promise<TServiceActionResponse<T>> {
    await this.repository?.startSession();

    const searchSimilarProp = this.createProps?.findSameBy ?? 'name';
    const sameProp =
      this.createProps?.findSameBy !== null
        ? await this.repository?.get(null, {
            select: `main.${searchSimilarProp}`,
            where: `main.${searchSimilarProp} like '${item[searchSimilarProp as keyof typeof item]}'`,
          })
        : null;

    if (sameProp) {
      Utils.error(res, 405);
      return { success: false };
    }

    const data = await this.repository?.add(item);
    this.repository?.endSession();

    if (!data) {
      Utils.error(res, 500);
      return { success: false };
    }

    return { success: true, data };
  }

  private async serviceUpdate(
    args: IArgs,
    item: z.infer<any>,
  ): Promise<TServiceActionResponse<T>> {
    await this.repository?.startSession();

    const entity = await this.repository?.get(item.id, this.updateProps?.scopeFn?.(args));
    if (!entity) {
      Utils.error(args.res, 404);
      return { success: false };
    }

    const updated = await this.repository?.update(item);
    this.repository?.endSession();

    if (!updated) {
      Utils.error(args.res, 500);
      return { success: false };
    }

    return { success: true, data: updated };
  }

  private async serviceDelete(id: number) {
    await this.repository?.startSession();
    const result = await this.repository?.remove(id);
    this.repository?.endSession();
    return result;
  }
}
