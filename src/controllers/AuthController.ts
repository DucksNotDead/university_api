import { Utils } from '../shared/utils';
import { Globals } from '../shared/globals';
import { AuthService } from '../services/AuthService';
import { Controller } from '../helpers/decorators/controller';
import { Route } from '../helpers/decorators/route';
import { IArgs } from '../shared/types';
import { UserCredits } from '../models/User';

const authService = new AuthService();

@Controller('/auth')
export class AuthController {
  @Route('Post', '/login')
  async login({ res, body }: IArgs): Promise<any> {
    const credits = body(UserCredits);
    if (!credits) {
      return;
    }

    const check = await authService.login(credits);
    if (!check) {
      return Utils.error(res, 404);
    }
    const { user, token } = check;

    res.cookie(Globals.AUTH_COOKIE, token);
    return res.json({ user, token });
  }

  @Route('Post', '/')
  async authenticate({ req, res }: IArgs): Promise<any> {
    const token = req.cookies[Globals.AUTH_COOKIE];
    if (!token) {
      return Utils.error(res, 401);
    }

    const user = await authService.getUserByToken(token);
    if (!user) {
      return Utils.error(res, 401);
    }

    return res.json({ user });
  }

  @Route('Post', '/logout')
  async logout({ res }: IArgs): Promise<any> {
    res.clearCookie(Globals.AUTH_COOKIE);
    return res.json('logout success');
  }
}
