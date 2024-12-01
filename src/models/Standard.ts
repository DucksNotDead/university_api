import { Identifiable } from './_base';
import { number, z } from 'zod';
import { Content } from './Content';

export const Standard = Identifiable.extend({
  discipline_id: number(),
  contents: z.string(),
});

export const StandardExtended = Standard.omit({ contents: true }).extend({
  contents: Content.array(),
});

export type TStandard = z.infer<typeof Standard>;

export type TStandardExtended = z.infer<typeof StandardExtended>;
