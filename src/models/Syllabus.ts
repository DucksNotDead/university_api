import { Content, Identifiable } from './_base';
import { number, string, z } from 'zod';

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

export const SyllabusCreateDto = Syllabus.omit({ id: true });

export const SyllabusUpdateDto = SyllabusCreateDto.partial().merge(Identifiable);

export type TSyllabus = z.infer<typeof Syllabus>;

export type TSyllabusExtended = z.infer<typeof SyllabusExtended>;

export type TSyllabusCreateDto = z.infer<typeof SyllabusCreateDto>;

export type TSyllabusUpdateDto = z.infer<typeof SyllabusUpdateDto>;
