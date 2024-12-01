import { Dictionary, Identifiable } from './_base';
import { z } from 'zod';

export const Department = Dictionary.extend({
  faculty_id: z.number(),
});

export const DepartmentCreateDto = Department.omit({ id: true });

export const DepartmentUpdateDto = DepartmentCreateDto.partial().merge(Identifiable);

export type TDepartment = z.infer<typeof Department>;

export type TDepartmentCreateDto = z.infer<typeof DepartmentCreateDto>;

export type TDepartmentUpdateDto = z.infer<typeof DepartmentUpdateDto>;
