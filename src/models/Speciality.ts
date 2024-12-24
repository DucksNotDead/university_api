import { Dictionary, Identifiable } from './_base';
import { z } from 'zod';

export const Speciality = Dictionary.extend({
  faculty_id: z.number(),
  direction: z.string(),
});

export const SpecialityCreateDto = Speciality.omit({ id: true });

export const SpecialityUpdateDto = SpecialityCreateDto.partial().merge(Identifiable);

export type TSpeciality = z.infer<typeof Speciality>;

export type TSpecialityCreateDto = z.infer<typeof SpecialityCreateDto>;

export type TSpecialityUpdateDto = z.infer<typeof SpecialityUpdateDto>;
