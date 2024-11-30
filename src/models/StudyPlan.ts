import { Identifiable } from './_base';
import { number, string, z } from 'zod';
import { numberYear } from '../shared/dataTypes';

export const StudyPlan = Identifiable.extend({
  speciality_id: number(),
  year: numberYear(),
  description: string(),
});

export type TStudyPlan = z.infer<typeof StudyPlan>;
