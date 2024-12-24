import { z } from 'zod';

export const Identifiable = z.object({
  id: z.number(),
});

export const Dictionary = Identifiable.extend({
  name: z.string(),
});

export const Content = z.object({
  title: z.string(),
  text: z.string(),
});

export type TContent = z.infer<typeof Content>;

export type TDictionary = z.infer<typeof Dictionary>;

export type TIdentifiable = z.infer<typeof Identifiable>;
