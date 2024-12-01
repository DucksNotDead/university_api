import { Dictionary, Identifiable } from './_base';
import { number, z } from 'zod';

export const Discipline = Dictionary.extend({
  department_id: number(),
});

export const DisciplineCreateDto = Discipline.omit({ id: true });

export const DisciplineUpdateDto = DisciplineCreateDto.partial().merge(Identifiable);

export type TDiscipline = z.infer<typeof Discipline>;

export type TDisciplineCreateDto = z.infer<typeof DisciplineCreateDto>;

export type TDisciplineUpdateDto = z.infer<typeof DisciplineUpdateDto>;
