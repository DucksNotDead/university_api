import { Identifiable } from './_base';
import { number, string, z } from 'zod';

export const Syllabus = Identifiable.extend({
  discipline_id: number(),
  standard_id: number(),
  aims: string().optional(),
  competencies: string().optional(),
  requirements: string().optional(),
  position_in_scheme: string().optional(),
  contents: string().optional(), //TODO
});

export type TSyllabus = z.infer<typeof Syllabus>;
