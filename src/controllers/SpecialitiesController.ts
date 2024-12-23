import { Controller } from '../shared/helpers/decorators/controller';
import { Specialities } from '../db';
import { SpecialityCreateDto, SpecialityUpdateDto } from '../models/Speciality';

@Controller('/specialities', 'EducationDepartmentEmployee', {
  repository: Specialities,
  create: { dto: SpecialityCreateDto },
  update: { dto: SpecialityUpdateDto },
})
export default class {}
