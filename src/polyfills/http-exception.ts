import { HttpException } from '@nestjs/common';
import { isObject, isArray } from '@stlmpp/utils';

HttpException.createBody = (objectOrError: Record<string, any> | string, description?: string, status?: number) => {
  if (!objectOrError) {
    return { status, message: description, error: description };
  }
  return isObject(objectOrError) && !isArray(objectOrError)
    ? { ...objectOrError, error: description }
    : { status, message: objectOrError, error: description };
};
