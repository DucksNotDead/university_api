import { string, z } from 'zod';
import { Role } from './enums/RoleEnum';
import { Dictionary } from './_base';
import { longString, smallString } from '../shared/dataTypes';

export const User = Dictionary.extend({
  login: smallString(),
  surname: smallString(),
  middlename: smallString().optional(),
  role: z.nativeEnum(Role),
});

export const UserCredits = z.object({
  login: longString(),
  password: string(),
});

export type TUserCredits = z.infer<typeof UserCredits>;

export type TUser = z.infer<typeof User>
