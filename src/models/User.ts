import { string, z } from 'zod';
import { Role } from './enums/RoleEnum';
import { Dictionary, Identifiable } from './_base';
import { longString, smallString } from '../shared/dataTypes';

const UserLogin = z.object({
  login: longString(),
});

const UserPassword = z.object({
  password: string(),
});

export const User = Dictionary.merge(UserLogin).extend({
  surname: smallString(),
  middlename: smallString().optional(),
  role: z.nativeEnum(Role),
});

export const UserCredits = UserLogin.merge(UserPassword);

export const UserCreateDto = User.omit({ id: true }).merge(UserPassword);

export const UserUpdateDto = UserCreateDto.partial().merge(Identifiable);

export type TUser = z.infer<typeof User>;

export type TUserCredits = z.infer<typeof UserCredits>;

export type TUserCreateDto = z.infer<typeof UserCreateDto>;

export type TUserUpdateDto = z.infer<typeof UserUpdateDto>;
