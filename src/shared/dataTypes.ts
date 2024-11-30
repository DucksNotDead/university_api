import { z } from 'zod';

export const smallString = () => z.string().min(4).max(24)

export const longString = () => z.string().min(4).max(40)

export const number2 = () => z.number().min(1).max(99)

export const number3 = () => z.number().min(1).max(999)

export const numberYear = () => z.number().min(1970).max(3000)

