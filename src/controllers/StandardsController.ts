import { Controller } from '../shared/helpers/decorators/controller';
import { Standards } from '../db';
import { StandardCreateDto, StandardUpdateDto } from '../models/Standard';

@Controller('standards', 'EducationDepartmentEmployee', {
  repository: Standards,
  create: { dto: StandardCreateDto },
  update: { dto: StandardUpdateDto },
})
export default class {}
