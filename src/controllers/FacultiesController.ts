import { Controller } from '../helpers/decorators/controller';
import { FacultyCreateDto, FacultyUpdateDto, TFaculty } from '../models/Faculty';
import { CRUD } from '../helpers/crud';
import { Faculties } from '../dbConnect';

@Controller('/faculties', 'Admin')
export class FacultiesController extends CRUD<TFaculty> {
  constructor() {
    super({
      repository: Faculties,
      createDto: FacultyCreateDto,
      updateDto: FacultyUpdateDto,
      mainProp: 'name',
      searchProps: ['name'],
    });
  }
}
