import { Pool } from 'pg';
import { Repository } from './shared/helpers/repository';
import { TUser } from './models/User';
import { TFaculty } from './models/Faculty';
import { TDepartment } from './models/Department';
import { TDiscipline } from './models/Discipline';
import { TSyllabus } from './models/Syllabus';
import { TStandard } from './models/Standard';
import { TStudyPlan } from './models/StudyPlan';
import { TSpeciality } from './models/Speciality';
import { TAcademicLoad } from './models/AcademicLoad';
import { TDisciplineInStudyPlan } from './models/DisciplineInStudyPlan';

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
export const Syllabuses = new Repository<TSyllabus>('syllabuses');
export const Standards = new Repository<TStandard>('standards');
export const StudyPlans = new Repository<TStudyPlan>('study_plans');
export const Specialities = new Repository<TSpeciality>('specialities');
export const AcademicLoads = new Repository<TAcademicLoad>('academic_loads');
export const DisciplinesInStudyPlans = new Repository<TDisciplineInStudyPlan>(
  'disciplines_in_study_plans',
);