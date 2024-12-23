import { Dictionary, Identifiable } from './_base';
import { number, z } from 'zod';
import { longString } from '../shared/dataTypes';

export const Speciality = Dictionary.extend({
  faculty_id: number(),
  direction: longString(),
});

export const SpecialityCreateDto = Speciality.omit({ id: true });

export const SpecialityUpdateDto = SpecialityCreateDto.partial().merge(Identifiable);

export type TSpeciality = z.infer<typeof Speciality>;

export type TSpecialityCreateDto = z.infer<typeof SpecialityCreateDto>;

export type TSpecialityUpdateDto = z.infer<typeof SpecialityUpdateDto>;
