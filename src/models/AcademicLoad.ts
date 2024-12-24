import { z } from 'zod';
import { Identifiable } from './_base';

export const AcademicLoad = Identifiable.extend({
  speciality_id: z.number(),
  discipline_id: z.number(),
  volume: z.number(),
});

export const AcademicLoadCreateDto = AcademicLoad.omit({ id: true });

export const AcademicLoadUpdateDto = AcademicLoadCreateDto.partial().merge(Identifiable);

export type TAcademicLoad = z.infer<typeof AcademicLoad>;

export type TAcademicLoadCreateDto = z.infer<typeof AcademicLoadCreateDto>;

export type TAcademicLoadUpdateDto = z.infer<typeof AcademicLoadUpdateDto>;
