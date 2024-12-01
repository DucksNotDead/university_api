import { Identifiable } from './_base';
import { number, string, z } from 'zod';
import { Content } from './Content';

export const Syllabus = Identifiable.extend({
  discipline_id: number(),
  standard_id: number(),
  aims: string().optional(),
  competencies: string().optional(),
  requirements: string().optional(),
  position_in_scheme: string().optional(),
  contents: string().optional(), 
});

export const SyllabusExtended = Syllabus.omit({ contents: true }).extend({
  contents: Content.array(),
});

export type TSyllabus = z.infer<typeof Syllabus>;

export type TSyllabusExtended = z.infer<typeof SyllabusExtended>;
