import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Globals } from '../shared/globals';
import { TypeGuards } from '../shared/typeGuards';
import { Users } from '../dbConnect';
import { TUser, TUserCredits } from '../models/User';
import { TServiceActionResponse } from '../shared/types';
import { Utils } from '../shared/utils';

export class AuthService {
  async getUserByToken(
    res: Response,
    token: string,
  ): Promise<TServiceActionResponse<TUser>> {
    const payload = jwt.verify(token, Globals.SECRET);
    if (!TypeGuards.isJWTPayload(payload)) {
      Utils.error(res, 500, 'JWT');
      return { success: false };
    }

    const { iat, exp, ...user } = payload;
    if (!TypeGuards.isUser(user)) {
      Utils.error(res, 500, 'Получение пользователя из куки');
      return { success: false };
    }

    return { success: true, data: user };
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

  async login(
    res: Response,
    credits: TUserCredits,
  ): Promise<TServiceActionResponse<{ user: TUser; token: string }>> {
    const user = await this.getUserByCredits(credits);
    if (!user) {
      Utils.error(res, 404, 'пользователь')
      return { success: false };
    }
    const token = jwt.sign(user, Globals.SECRET, { expiresIn: '48h' });
    return { success: true, data: { user, token } };
  }
}
