import { EStudyType } from './enums/StudyTypeEnum';
import { Identifiable } from './_base';
import { number, z } from 'zod';
import { number2, number3 } from '../shared/dataTypes';

export const DisciplineInStudyPlan = Identifiable.extend({
  discipline_id: number(),
  study_plan_id: number(),
  semester: number2(),
  type: z.nativeEnum(EStudyType),
  hours: number3(),
});

export type TDisciplineInStudyPlan = z.infer<typeof DisciplineInStudyPlan>;
