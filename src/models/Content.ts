import { z } from 'zod';
import { longString } from '../shared/dataTypes';

export const Content = z.object({
  title: longString(),
  text: z.string(),
});

export type TContent = z.infer<typeof Content>;
