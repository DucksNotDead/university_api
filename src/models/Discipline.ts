import { Dictionary } from './_base';
import { number, z } from 'zod';

export const Discipline = Dictionary.extend({
  department_id: number(),
});

export type TDiscipline = z.infer<typeof Discipline>;
