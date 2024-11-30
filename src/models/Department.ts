import { Dictionary } from './_base';
import { z } from 'zod';

export const Department = Dictionary.extend({
  faculty_id: z.number(),
});

export type TDepartment = z.infer<typeof Department>;
