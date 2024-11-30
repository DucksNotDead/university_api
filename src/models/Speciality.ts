import { Dictionary } from './_base';
import { number, z } from 'zod';
import { longString } from '../shared/dataTypes';

export const Speciality = Dictionary.extend({
  faculty_id: number(),
  direction: longString(),
});

export type TSpeciality = z.infer<typeof Speciality>;
