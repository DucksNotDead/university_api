import { Controller } from '../helpers/decorators/controller';
import { CRUD } from '../helpers/crud';
import { TUser, UserCreateDto, UserUpdateDto } from '../models/User';
import { Users } from '../dbConnect';

@Controller('/users', 'Admin')
export class UsersController extends CRUD<TUser> {
  constructor() {
    super({
      repository: Users,
      createDto: UserCreateDto,
      updateDto: UserUpdateDto,
      mainProp: 'login',
      searchProps: ['login', 'name', 'surname', 'middlename'],
    });
  }
}
