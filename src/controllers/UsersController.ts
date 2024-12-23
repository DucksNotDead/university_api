import { Controller } from '../shared/helpers/decorators/controller';
import { TUser, UserCreateDto, UserUpdateDto } from '../models/User';
import { Users } from '../db';

@Controller('/users', 'Admin', {
  repository: Users,
  get: { extraProps: ['password' as keyof TUser] },
  create: { dto: UserCreateDto },
  update: { dto: UserUpdateDto },
})
export default class {}
