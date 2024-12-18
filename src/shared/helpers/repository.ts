import { PoolClient } from 'pg';
import { DBPool } from '../../db';
import { TIdentifiable } from '../../models/_base';
import { TPagination } from '../../models/FiltersAndPagination';
import { Utils } from '../utils';
import { IScope } from '../types';

interface IRepositorySubQuery extends IScope {
  select?: string;
}

export class Repository<T extends TIdentifiable> {
  private tableName = '';
  private client: PoolClient | null = null;

  private readonly DEFAULT_PAGE_SIZE = 10;

  constructor(table_name: string) {
    this.tableName = table_name;
  }

  async startSession() {
    try {
      this.client = await DBPool.connect();
      return true;
    } catch (e) {
      this.errorLog('start', e, '');
    }
  }

  endSession() {
    this.client?.release();
    this.client = null;
  }

  async getAll(filter?: IRepositorySubQuery & TPagination['pagination']) {
    const pageSize = filter?.pageSize ?? this.DEFAULT_PAGE_SIZE;

    const query = `
        SELECT ${filter?.select ?? '*'} 
        FROM ${this.tableName} as main
        ${filter?.joins?.map(([table, name, cond]) => `LEFT JOIN ${table} as ${name} on ${cond}`).join(' ') ?? ''}
        WHERE ${filter?.where?.length ? filter.where : '1 = 1'}
        ORDER BY main.id
        LIMIT ${pageSize} OFFSET (${filter?.pageIndex ?? 0}) * ${pageSize}
        ;`;

    try {
      const { rows } = await this.client!.query<T>(query);
      return rows;
    } catch (e) {
      this.errorLog('getAll', e, query);
      return null;
    }
  }

  async get(id: number | null, filter?: IRepositorySubQuery) {
    return (
      (
        await this.getAll({
          ...filter,
          where: `${id ? `main.id = ${id}` : '1 = 1'} ${filter?.where ? 'AND ' + filter?.where : ''}`,
          pageSize: 1,
        })
      )?.[0] ?? null
    );
  }

  async add<DTO extends Omit<T, 'id'>>(item: DTO) {
    const columnNames = Object.keys(item).join(', ');
    const values = Object.values(item).map((v: any) =>
      typeof v === 'string' ? Utils.toQuoteless(v) : v,
    );
    const valueIndexes = Array.from(Array(values.length), (_, i) => `$${i + 1}`).join(
      ',',
    );
    const query = `
          INSERT INTO ${this.tableName}(${columnNames})
          VALUES (${valueIndexes})
          RETURNING *
          ;`;

    try {
      return (
        await this.client!.query<T>({
          text: query,
          values,
        })
      ).rows[0];
    } catch (e) {
      this.errorLog('add', e, query);
      return null;
    }
  }

  async remove(id: number, subquery?: string) {
    const itemExist = await this.get(id);
    if (!itemExist) {
      return false;
    }

    const query = `
        DELETE FROM ${this.tableName} as main
        WHERE main.id = ${id} ${subquery ? 'AND ' + subquery : ''}
        ;`;

    try {
      await this.client!.query({
        text: query,
      });
      return true;
    } catch (e) {
      this.errorLog('remove', e, query);
      return false;
    }
  }

  async update(item: Partial<Omit<T, 'id'>> & TIdentifiable, subquery?: string) {
    const { id, ...props } = item;
    const columnNames = Object.keys(props);
    const values = Object.values(props).map((v: any) =>
      typeof v === 'string' ? Utils.toQuoteless(v) : v,
    );
    const setters = columnNames
      .map((column, index) => `${column} = $${index + 1}`)
      .join(', ');

    const query = `
        UPDATE ${this.tableName}
        SET ${setters}
        WHERE id = ${id} ${subquery ? 'AND ' + subquery : ''}
        RETURNING *
        ;`;

    try {
      return (
        (
          await this.client!.query<T>({
            text: query,
            values,
          })
        ).rows[0] ?? null
      );
    } catch (e) {
      this.errorLog('update', e, query);
      return null;
    }
  }

  private errorLog(
    method: 'start' | 'get' | 'getAll' | 'add' | 'update' | 'remove',
    e: unknown,
    query: string,
  ) {
    console.log(`\nError while ${method} ${this.tableName}\n\n${query}\n\n${e}\n`);
  }
}
