import { z } from 'zod';
import { longString } from '../shared/dataTypes';

export const Identifiable = z.object({
  id: z.number(),
});

export const Dictionary = Identifiable.extend({
  name: longString(),
});

export const Content = z.object({
  title: longString(),
  text: z.string(),
});

export type TContent = z.infer<typeof Content>;

export type TDictionary = z.infer<typeof Dictionary>;

export type TIdentifiable = z.infer<typeof Identifiable>;
