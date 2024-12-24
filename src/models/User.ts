import { z } from 'zod';
import { Role } from './enums/RoleEnum';
import { Dictionary, Identifiable } from './_base';

const UserLogin = z.object({
  login: z.string(),
});

const UserPassword = z.object({
  password: z.string(),
});

export const User = Identifiable.merge(UserLogin).extend({
  fio: z.string(),
  role: z.nativeEnum(Role),
});

export const UserCredits = UserLogin.merge(UserPassword);

export const UserCreateDto = User.omit({ id: true }).merge(UserPassword);

export const UserUpdateDto = UserCreateDto.partial().merge(Identifiable);

export type TUser = z.infer<typeof User>;

export type TUserCredits = z.infer<typeof UserCredits>;

export type TUserCreateDto = z.infer<typeof UserCreateDto>;

export type TUserUpdateDto = z.infer<typeof UserUpdateDto>;
