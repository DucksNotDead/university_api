import jwt from 'jsonwebtoken';
import { Globals } from '../shared/globals';
import { TypeGuards } from '../shared/typeGuards';
import { Users } from '../dbConnect';
import { TUserCredits } from '../models/User';

export class AuthService {
  async getUserByToken(token: string) {
    const payload = jwt.verify(token, Globals.SECRET);
    if (!TypeGuards.isJWTPayload(payload)) {
      return null;
    }

    const { iat, exp, ...user } = payload;
    if (!TypeGuards.isUser(user)) {
      return null;
    }

    return user;
  }

  private async getUserByCredits({ login, password }: TUserCredits) {
    await Users.startSession();
    const user = await Users.get(null, {
      where: `main.login = \'${login}\' and main.password = \'${password}\'`,
    });
    Users.endSession();

    if (user) {
      delete (user as any).password;
    }

    return user;
  }

  async login(credits: TUserCredits) {
    const user = await this.getUserByCredits(credits);
    if (!user) {
      return null;
    }
    const token = jwt.sign(user, Globals.SECRET, { expiresIn: '48h' });
    return { user, token };
  }
}
