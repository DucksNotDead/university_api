import { Route } from './decorators/route';
import { IArgs, TServiceActionResponse } from '../shared/types';
import {
  FiltersAndPagination,
  TFiltersAndPagination,
} from '../models/FiltersAndPagination';
import { Utils } from '../shared/utils';
import { ZodObject } from 'zod';
import { Repository } from './repository';
import { TIdentifiable } from '../models/_base';
import { Response } from 'express';

export class CRUD<T extends TIdentifiable> {
  repository: Repository<T> | null = null;
  createDto: any;
  updateDto: any;
  mainProp?: keyof T;
  searchProps?: (keyof T)[];

  constructor(properties: {
    repository: Repository<T>;
    createDto: ZodObject<any>;
    updateDto: ZodObject<any>;
    mainProp?: keyof T;
    searchProps?: (keyof T)[];
  }) {
    this.repository = properties.repository;
    this.createDto = properties.createDto;
    this.updateDto = properties.updateDto;
    this.mainProp = properties.mainProp;
    this.searchProps = properties.searchProps;
  }

  @Route('Get', '/')
  async getAll({ res, body, context }: IArgs<T>) {
    try {
      const { success, data: filtersAndPagination } = body(FiltersAndPagination);
      if (!success) {
        return;
      }

      const users = await context.serviceGetAll(res, filtersAndPagination);
      if (!users.success) {
        return;
      }

      return Utils.success(res, users.data);
    } catch (err) {
      return Utils.error(res, 500);
    }
  }

  @Route('Post', '/')
  async create({ res, body, context }: IArgs) {
    try {
      const { success, data: dto } = body(context.createDto);
      if (!success) {
        return;
      }

      const result = await context.serviceCreate(res, dto);
      if (!result.success) {
        return;
      }

      return Utils.success(res, result.data);
    } catch (err) {
      return Utils.error(res, 500);
    }
  }

  @Route('Put', '/')
  async update({ res, body, context }: IArgs) {
    try {
      const { success, data: dto } = body(context.updateDto);
      if (!success) {
        return;
      }

      const result = await context.serviceUpdate(res, dto);
      if (!result.success) {
        return;
      }

      return Utils.success(res, result.data);
    } catch (err) {
      return Utils.error(res, 500);
    }
  }

  @Route('Delete', '/:id')
  async delete({ res, params, context }: IArgs) {
    try {
      const id = Number(params.id);

      const result = await context.serviceDelete(id);
      if (!result) {
        return Utils.error(res, 404);
      }
      return Utils.success(res, id);
    } catch (err) {
      return Utils.error(res, 500);
    }
  }

  private async serviceGetAll(
    res: Response,
    filtersAndPagination: TFiltersAndPagination,
  ): Promise<TServiceActionResponse<T[]>> {
    const { filters, pagination } = filtersAndPagination!;

    const where = Utils.parseFilters(filters, this.searchProps as string[]);

    await this.repository?.startSession();
    const departments = await this.repository?.getAll({ where, ...pagination });
    this.repository?.endSession();
    if (!departments) {
      Utils.error(res, 500);
      return { success: false };
    }
    return { success: true, data: departments };
  }

  private async serviceCreate(
    res: Response,
    item: typeof this.createDto,
  ): Promise<TServiceActionResponse<T>> {
    await this.repository?.startSession();
    const sameProp =
      typeof this.mainProp === 'string'
        ? await this.repository?.get(null, {
            select: `main.${this.mainProp}`,
            where: `main.${this.mainProp} like '${item[this.mainProp as keyof typeof item]}'`,
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
    res: Response,
    item: typeof this.updateDto,
  ): Promise<TServiceActionResponse<T>> {
    await this.repository?.startSession();
    const faculty = await this.repository?.get(item.id);
    if (!faculty) {
      Utils.error(res, 404);
      return { success: false };
    }
    const updated = await this.repository?.update(item);
    this.repository?.endSession();
    if (!updated) {
      Utils.error(res, 500);
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
