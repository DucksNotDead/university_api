import { Controller } from '../shared/helpers/decorators/controller';
import { DisciplineCreateDto, DisciplineUpdateDto } from '../models/Discipline';
import { Disciplines } from '../db';

/*const departmentIdProp = 'department_id';

const scopeFn: TScopeFn = ({ user }) => ({
  where: `main.${departmentIdProp} = ${user?.[departmentIdProp]}`,
});

const scopeFilterFn: TScopeFilterFn = (args) => ({
  prop: departmentIdProp,
  scope: scopeFn(args),
});*/

@Controller('/disciplines', 'DepartmentHead', {
  repository: Disciplines,
  create: { dto: DisciplineCreateDto },
  update: { dto: DisciplineUpdateDto },
})
export default class {}
