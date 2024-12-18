import { ZodError } from 'zod';

interface IErrorValidation {
  type: 'validation';
  data: ZodError;
}

interface IErrorCommon {
  type: 'common';
  code: number;
  data: string;
}

interface IPropsSuccess<T> {
  data: T;
}

interface IPropsErrorCommon { code: number; text: string }

interface IPropsError {
  error: IPropsErrorCommon | ZodError;
}

type TResultProps<T> = IPropsSuccess<T> | IPropsError;

type TResultError = IErrorCommon | IErrorValidation;

function successGuard<T>(props: any): props is IPropsSuccess<T> {
  return !!props.data;
}

function errorCommonTypeGuard(error: any): error is IPropsErrorCommon {
  return !!(error.code && error.text)
}

export class Result<T> {
  success: boolean = false;
  data: T | null = null;
  error: TResultError | null = null;

  constructor(props: TResultProps<T>) {
    if (successGuard(props)) {
      this.success = true;
      this.data = props.data;
      this.error = null;
    } else {
      this.success = false;
      this.data = null;
      this.error =
        errorCommonTypeGuard(props.error)
          ? { type: 'common', code: props.error.code, data: props.error.text }
          : { type: 'validation', data: props.error };
    }
  }
}
