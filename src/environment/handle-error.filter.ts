import { BaseExceptionFilter } from '@nestjs/core';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { environment } from './environment';
import { MysqlError } from 'mysql';
import { isObject } from 'st-utils';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Response } from 'express';

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
    } else if (this.isSqlError(exception)) {
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
    (host.switchToHttp().getResponse() as Response).status(status).json(errorObj);
  }

  handleSqlError(exception: MysqlError): HttpException {
    const { message, errno } = exception;
    const errorObj = { sqlMessage: message, sqlErrno: errno };
    switch (errno) {
      case 1452:
        return new NotFoundException(errorObj);
      case 1169:
      case 1557:
      case 1062:
        return new ConflictException(errorObj);
      case 1451:
        return new ConflictException({
          ...errorObj,
          message: `Can't finish operation because of relationship`,
        });
      case 1048:
      case 1054:
      case 1265:
      case 1364:
        return new BadRequestException(errorObj);
      default:
        return new InternalServerErrorException(errorObj);
    }
  }

  handleEntityNotFoundError(error: EntityNotFoundError): HttpException {
    return new NotFoundException(error.message);
  }

  isSqlError(exception: any): exception is MysqlError {
    return !!exception?.sql;
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
