import { Identifiable } from './_base';
import { z } from 'zod';

export const Syllabus = Identifiable.extend({
  discipline_id: z.number(),
  standard_id: z.number(),
  aims: z.string(),
  competencies: z.string(),
  requirements: z.string(),
  position_in_scheme: z.string(),
  approved: z.boolean(),
  year: z.number()
});

export const SyllabusCreateDto = Syllabus.omit({ id: true });

export const SyllabusUpdateDto = SyllabusCreateDto.partial().merge(Identifiable);

export type TSyllabus = z.infer<typeof Syllabus>;

export type TSyllabusCreateDto = z.infer<typeof SyllabusCreateDto>;

export type TSyllabusUpdateDto = z.infer<typeof SyllabusUpdateDto>;
