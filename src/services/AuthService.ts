import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Globals } from '../shared/globals';
import { TypeGuards } from '../shared/typeGuards';
import { Users } from '../db';
import { TUser, TUserCredits } from '../models/User';
import { TServiceActionResponse } from '../shared/types';
import { Utils } from '../shared/utils';

export class AuthService {
  async getUserByToken(
    token: string,
  ): Promise<TServiceActionResponse<TUser>> {
    try {
      const payload = jwt.verify(token, Globals.SECRET);
      if (!TypeGuards.isJWTPayload(payload)) {
        return { success: false };
      }

      const { iat, exp, ...user } = payload;
      if (!TypeGuards.isUser(user)) {
        return { success: false };
      }

      return { success: true, data: user };
    } catch (error) {
      return { success: false };
    }
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
