import { Controller } from '../shared/helpers/decorators/controller';
import { Departments } from '../db';
import { DepartmentCreateDto, DepartmentUpdateDto } from '../models/Department';

@Controller('/departments', 'Admin', {
  repository: Departments,
  create: { dto: DepartmentCreateDto, findSameBy: 'head_id' },
  update: { dto: DepartmentUpdateDto },
})
export default class {}
