import { PoolClient } from 'pg';
import { DBPool } from '../../db';
import { TIdentifiable } from '../../models/_base';
import { Utils } from '../utils';
import { IScope } from '../types';

interface IRepositorySubQuery extends IScope {
  select?: string;
}

export class Repository<T extends TIdentifiable> {
  private tableName = '';
  private client: PoolClient | null = null;

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

  async getAll(filter?: IRepositorySubQuery) {
    const query = `
        SELECT ${filter?.select ?? '*'} 
        ${filter?.joins?.map(([table, name, cond]) => {
          let selectQuery = `row_to_json(${name})`
          let fromName = name
          let asName = name
          if (name.includes('.')) {
            const [tableName, propName] = name.split('.')
            selectQuery = name
            fromName = tableName
            asName = `${tableName}_${propName}`
          }
          return `,(
            SELECT ${selectQuery}
            FROM ${table} as ${fromName}
            WHERE ${cond}
          ) as ${asName}`
        }) ?? ''}
        FROM ${this.tableName} as main
        WHERE ${filter?.where?.length ? filter.where : '1 = 1'}
        ORDER BY main.id
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
