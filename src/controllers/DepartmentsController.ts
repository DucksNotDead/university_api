import { Controller } from '../shared/helpers/decorators/controller';
import { Departments } from '../db';
import { DepartmentCreateDto } from '../models/Department';
import { DisciplineUpdateDto } from '../models/Discipline';

@Controller('/departments', 'Admin', {
  repository: Departments,
  create: { dto: DepartmentCreateDto, findSameBy: 'head_id' },
  update: { dto: DisciplineUpdateDto },
})
export default class {}
