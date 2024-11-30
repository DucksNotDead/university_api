import { Dictionary } from './_base';
import { z } from 'zod';

export const Faculty = Dictionary.extend({});

export type TFaculty = z.infer<typeof Faculty>;
