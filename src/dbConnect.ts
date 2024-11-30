import { Pool } from 'pg';
import { Repository } from './helpers/repository';
import { TUser } from './models/User';

export const DBPool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'university',
});

export const Users = new Repository<TUser>('users')
