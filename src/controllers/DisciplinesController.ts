import { Controller } from '../shared/helpers/decorators/controller';
import { DisciplineCreateDto, DisciplineUpdateDto } from '../models/Discipline';
import { Disciplines } from '../db';
import { TScopeFilterFn, TScopeFn } from '../shared/types';

const departmentIdProp = 'department_id';

const scopeFn: TScopeFn = ({ user }) => ({
  where: `main.${departmentIdProp} = ${user?.[departmentIdProp]}`,
});

const scopeFilterFn: TScopeFilterFn = (args) => ({
  prop: departmentIdProp,
  scope: scopeFn(args),
});

@Controller('/disciplines', 'DepartmentHead', {
  repository: Disciplines,
  get: { scopeFilterFn },
  create: { dto: DisciplineCreateDto },
  update: { dto: DisciplineUpdateDto, scopeFn },
})
export default class {}
