import { Controller } from '../shared/helpers/decorators/controller';
import { StudyPlans } from '../db';
import { StudyPlanCreateDto, StudyPlanUpdateDto } from '../models/StudyPlan';

@Controller('/study-plans', 'EducationDepartmentEmployee', {
  repository: StudyPlans,
  create: { dto: StudyPlanCreateDto, findSameBy: null },
  update: { dto: StudyPlanUpdateDto },
})
export default class {}