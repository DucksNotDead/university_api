import { Controller } from '../shared/helpers/decorators/controller';
import { UserCreateDto, UserUpdateDto } from '../models/User';
import { Users } from '../db';

@Controller('/users', 'Admin', {
  repository: Users,
  get: { searchBy: ['login', 'name', 'surname', 'middlename'] },
  create: { dto: UserCreateDto },
  update: { dto: UserUpdateDto },
})
export default class {}
