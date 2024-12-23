import { Controller } from '../shared/helpers/decorators/controller';
import { AcademicLoadCreateDto, AcademicLoadUpdateDto } from '../models/AcademicLoad';
import { AcademicLoads } from '../db';

@Controller('/academic-loads', 'EducationDepartmentEmployee', {
  repository: AcademicLoads,
  create: { dto: AcademicLoadCreateDto },
  update: { dto: AcademicLoadUpdateDto },
})
export default class {}
