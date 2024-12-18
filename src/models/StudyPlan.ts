import { Identifiable } from './_base';
import { number, string, z } from 'zod';
import { numberYear } from '../shared/dataTypes';

export const StudyPlan = Identifiable.extend({
  speciality_id: number(),
  year: numberYear(),
  description: string(),
});

export const StudyPlanCreateDto = StudyPlan.omit({ id: true });

export const StudyPlanUpdateDto = StudyPlanCreateDto.partial().merge(Identifiable);

export type TStudyPlan = z.infer<typeof StudyPlan>;

export type TStudyPlanCreateDto = z.infer<typeof StudyPlanCreateDto>;

export type TStudyPlanUpdateDto = z.infer<typeof StudyPlanUpdateDto>;
