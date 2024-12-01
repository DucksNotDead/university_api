import { Controller } from '../helpers/decorators/controller';
import { CRUD } from '../helpers/crud';
import { DisciplineCreateDto, TDiscipline } from '../models/Discipline';
import { Disciplines } from '../dbConnect';
import { DepartmentUpdateDto } from '../models/Department';

@Controller('/disciplines', 'DepartmentHead')
export class DisciplinesController extends CRUD<TDiscipline> {
  constructor() {
    super({
      repository: Disciplines,
      createDto: DisciplineCreateDto,
      updateDto: DepartmentUpdateDto,
      mainProp: 'name',
      searchProps: ['name'],
    });
  }
}
