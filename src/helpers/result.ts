import { ZodError } from 'zod';

interface IErrorValidation {
  type: 'validation';
  data: ZodError;
}

interface IErrorCommon {
  type: 'common';
  data: string;
}

interface IPropsSuccess<T> {
  data: T;
}

interface IPropsError {
  error: string | ZodError;
}

type TResultProps<T> = IPropsSuccess<T> | IPropsError;

type TResultError = IErrorCommon | IErrorValidation;

function successGuard<T>(props: any): props is IPropsSuccess<T> {
  return !!props.data;
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
        typeof props.error === 'string'
          ? { type: 'common', data: props.error }
          : { type: 'validation', data: props.error };
    }
  }
}
