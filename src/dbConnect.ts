import { Pool } from 'pg';
import { Repository } from './helpers/repository';
import { TUser } from './models/User';
import { TFaculty } from './models/Faculty';
import { TDepartment } from './models/Department';
import { TDiscipline } from './models/Discipline';

export const DBPool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'university',
});

export const Users = new Repository<TUser>('users');
export const Faculties = new Repository<TFaculty>('faculties');
export const Departments = new Repository<TDepartment>('departments');
export const Disciplines = new Repository<TDiscipline>('disciplines');