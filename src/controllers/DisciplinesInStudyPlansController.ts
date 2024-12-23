import { Controller } from '../shared/helpers/decorators/controller';
import { DisciplinesInStudyPlans } from '../db';
import {
  DisciplineInStudyPlanCreateDto,
  DisciplineInStudyPlanUpdateDto,
} from '../models/DisciplineInStudyPlan';

@Controller('disciplines-in-study-plans', 'EducationDepartmentEmployee', {
  repository: DisciplinesInStudyPlans,
  create: { dto: DisciplineInStudyPlanCreateDto },
  update: { dto: DisciplineInStudyPlanUpdateDto },
})
export default class {}
