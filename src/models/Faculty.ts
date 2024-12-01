import { Dictionary, Identifiable } from './_base';
import { z } from 'zod';

export const Faculty = Dictionary.extend({});

export const FacultyCreateDto = Faculty.omit({ id: true });

export const FacultyUpdateDto = FacultyCreateDto.partial().merge(Identifiable);

export type TFaculty = z.infer<typeof Faculty>;

export type TFacultyCreateDto = z.infer<typeof FacultyCreateDto>;

export type TFacultyUpdateDto = z.infer<typeof FacultyUpdateDto>;
