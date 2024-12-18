import { Controller } from '../shared/helpers/decorators/controller';
import { Specialities } from '../db';
import { StandardCreateDto, StandardUpdateDto } from '../models/Standard';

@Controller('/specialities', 'EducationDepartmentEmployee', {
  repository: Specialities,
  create: { dto: StandardCreateDto },
  update: { dto: StandardUpdateDto },
})
export default class {}
