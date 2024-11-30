import { z } from 'zod';
import { Identifiable } from './_base';
import { number3 } from '../shared/dataTypes';

export const AcademicLoad = Identifiable.extend({
  speciality_id: z.number(),
  discipline_id: z.number(),
  volume: number3(),
});

export type TAcademicLoad = z.infer<typeof AcademicLoad>;
