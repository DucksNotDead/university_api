import { Identifiable } from './_base';
import { number, string, z } from 'zod';

export const Syllabus = Identifiable.extend({
  discipline_id: number(),
  standard_id: number(),
  aims: string(),
  competencies: string(),
  requirements: string(),
  position_in_scheme: string(),
});

export const SyllabusCreateDto = Syllabus.omit({ id: true });

export const SyllabusUpdateDto = SyllabusCreateDto.partial().merge(Identifiable);

export type TSyllabus = z.infer<typeof Syllabus>;

export type TSyllabusCreateDto = z.infer<typeof SyllabusCreateDto>;

export type TSyllabusUpdateDto = z.infer<typeof SyllabusUpdateDto>;
