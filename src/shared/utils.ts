import { Response } from 'express';
import { Errors } from './errors';

export const Utils = {
  error(res: Response, status: keyof typeof Errors, message?: string) {
    return res.status(status).json(`${Errors[status]}${message ? `. ${message}` : ''}`);
  },
};
