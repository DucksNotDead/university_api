import { Controller } from '../helpers/decorators/controller';
import { CRUD } from '../helpers/crud';
import { DepartmentUpdateDto, TDepartment } from '../models/Department';
import { Departments } from '../dbConnect';
import { DisciplineCreateDto } from '../models/Discipline';

@Controller('/departments', 'Admin')
export class DepartmentsController extends CRUD<TDepartment> {
  constructor() {
    super({
      repository: Departments,
      createDto: DisciplineCreateDto,
      updateDto: DepartmentUpdateDto,
      mainProp: 'name',
      searchProps: ['name'],
    });
  }
}
