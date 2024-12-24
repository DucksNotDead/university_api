import { Identifiable } from './_base';
import { z } from 'zod';

export const StudyPlan = Identifiable.extend({
  speciality_id: z.number(),
  year: z.number(),
  description: z.string(),
});

export const StudyPlanCreateDto = StudyPlan.omit({ id: true });

export const StudyPlanUpdateDto = StudyPlanCreateDto.partial().merge(Identifiable);

export type TStudyPlan = z.infer<typeof StudyPlan>;

export type TStudyPlanCreateDto = z.infer<typeof StudyPlanCreateDto>;

export type TStudyPlanUpdateDto = z.infer<typeof StudyPlanUpdateDto>;
