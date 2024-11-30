import { Identifiable } from './_base';
import { number, z } from 'zod';

export const Standard = Identifiable.extend({
  discipline_id: number(),
  contents: number(), //TODO
});

export type TStandard = z.infer<typeof Standard>;
