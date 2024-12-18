import { Utils } from '../shared/utils';
import { Globals } from '../shared/globals';
import { AuthService } from '../services/AuthService';
import { Controller } from '../shared/helpers/decorators/controller';
import { Route } from '../shared/helpers/decorators/route';
import { IArgs } from '../shared/types';
import { UserCredits } from '../models/User';

const authService = new AuthService();

@Controller('/auth', 'User')
export default class {
  @Route('Post', '/login', { isPublic: true })
  async login({ res, body }: IArgs): Promise<any> {
    const { success, data: credits } = body(UserCredits);
    if (!success) {
      return;
    }

    const check = await authService.login(res, credits);
    if (!check.success) {
      return;
    }
    const { user, token } = check.data;

    res.cookie(Globals.AUTH_COOKIE, token);
    return Utils.success(res, { user, token });
  }

  @Route('Post', '/', { isPublic: true })
  async authenticate({ req, res }: IArgs): Promise<any> {
    const token = req.cookies[Globals.AUTH_COOKIE];
    if (!token) {
      return Utils.error(res, 401);
    }

    const user = await authService.getUserByToken(token);
    if (!user.success) {
      return;
    }

    return Utils.success(res, user.data);
  }

  @Route('Post', '/logout', { isPublic: true })
  async logout({ res }: IArgs): Promise<any> {
    res.clearCookie(Globals.AUTH_COOKIE);
    return Utils.success(res, 'logout success');
  }
}
