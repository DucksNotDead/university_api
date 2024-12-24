import { EStudyType } from './enums/StudyTypeEnum';
import { Identifiable } from './_base';
import { z } from 'zod';

export const DisciplineInStudyPlan = Identifiable.extend({
  discipline_id: z.number(),
  study_plan_id: z.number(),
  semester: z.number(),
  type: z.nativeEnum(EStudyType),
  hours: z.number(),
});

export const DisciplineInStudyPlanCreateDto = DisciplineInStudyPlan.omit({ id: true });

export const DisciplineInStudyPlanUpdateDto =
  DisciplineInStudyPlanCreateDto.partial().merge(Identifiable);

export type TDisciplineInStudyPlan = z.infer<typeof DisciplineInStudyPlan>;

export type TDisciplineInStudyPlanCreateDto = z.infer<
  typeof DisciplineInStudyPlanCreateDto
>;

export type TDisciplineInStudyPlanUpdateDto = z.infer<
  typeof DisciplineInStudyPlanUpdateDto
>;
