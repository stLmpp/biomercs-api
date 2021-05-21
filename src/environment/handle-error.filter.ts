import { BaseExceptionFilter } from '@nestjs/core';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { environment } from './environment';
import { isObject } from 'st-utils';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { PostgresQueryError } from '../shared/type/postgress-error';
import { PostgresError } from 'pg-error-enum';
import { Type } from '../util/type';

@Catch()
export class HandleErrorFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    if (!environment.config('USE_HANDLE_ERROR')) {
      super.catch(exception, host);
      return;
    }
    const applicationRef = this.applicationRef ?? this.httpAdapterHost?.httpAdapter;
    if (!applicationRef) {
      super.catch(exception, host);
      if (!environment.production) {
        Logger.error(exception);
      }
      return;
    }
    let error: HttpException;
    if (this.isEntityNotFoundError(exception)) {
      error = this.handleEntityNotFoundError(exception);
    } else if (this.isQueryFailedError(exception)) {
      error = this.handleSqlError(exception);
    } else if (this.isThrownError(exception)) {
      error = this.handleThrownError(exception);
    } else {
      super.catch(exception, host);
      if (!environment.production) {
        Logger.error(exception);
      }
      return;
    }
    const response = error.getResponse();
    const status = error.getStatus();
    let errorObj: Record<string, any> = { status };
    if (isObject(response)) {
      errorObj = { ...errorObj, ...response };
    } else {
      errorObj.message = response;
    }
    if (!environment.production) {
      Logger.error(errorObj);
    }
    host.switchToHttp().getResponse().status(status).json(errorObj);
  }

  handleSqlError({ message, name, stack, ...sqlError }: PostgresQueryError): HttpException {
    const objError = { message, sqlError };
    let exception: Type<HttpException>;
    switch (sqlError.code) {
      // TODO implement more errors
      case PostgresError.NO_DATA_FOUND:
        exception = NotFoundException;
        break;
      case PostgresError.SYNTAX_ERROR:
        exception = InternalServerErrorException;
        break;
      default:
        exception = InternalServerErrorException;
    }
    return new exception(objError);
  }

  handleEntityNotFoundError(error: EntityNotFoundError): HttpException {
    return new NotFoundException(error.message);
  }

  isQueryFailedError(exception: any): exception is PostgresQueryError {
    return exception instanceof QueryFailedError;
  }

  isEntityNotFoundError(exception: any): exception is EntityNotFoundError {
    return exception instanceof EntityNotFoundError;
  }

  isThrownError(exception: any): exception is HttpException {
    return exception instanceof HttpException;
  }

  handleThrownError(exception: HttpException): HttpException {
    return exception;
  }
}
