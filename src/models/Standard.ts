import { Content, Identifiable } from './_base';
import { number, z } from 'zod';

export const Standard = Identifiable.extend({
  discipline_id: number(),
  contents: z.string(),
});

export const StandardExtended = Standard.omit({ contents: true }).extend({
  contents: Content.array(),
});

export const StandardCreateDto = Standard.omit({ id: true });

export const StandardUpdateDto = StandardCreateDto.partial().merge(Identifiable);

export type TStandard = z.infer<typeof Standard>;

export type TStandardExtended = z.infer<typeof StandardExtended>;

export type TStandardCreateDto = z.infer<typeof StandardCreateDto>;

export type TStandardUpdateDto = z.infer<typeof StandardUpdateDto>;
