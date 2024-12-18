import { Controller } from '../shared/helpers/decorators/controller';
import { Faculties } from '../db';
import { FacultyCreateDto, FacultyUpdateDto } from '../models/Faculty';

@Controller('/faculties', 'Admin', {
  repository: Faculties,
  create: { dto: FacultyCreateDto },
  update: { dto: FacultyUpdateDto },
})
export default class {}
