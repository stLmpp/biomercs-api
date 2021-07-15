import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, from, map, Observable } from 'rxjs';
import { ErrorAddDto } from './error.dto';
import { isFunction, isNil, isObject } from 'st-utils';
import { ErrorService } from './error.service';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private errorService: ErrorService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(error => {
        const payload = new ErrorAddDto();
        if (isNil(error)) {
          // This should never happen, and will be very hard to debug if happens
          payload.name = 'Unknown error';
          payload.message = 'Unknown error';
          payload.stack = 'No stack';
        } else if (!isObject(error)) {
          let errorString: string;
          if (isFunction(error.toString)) {
            errorString = error.toString();
          } else {
            errorString = `${error}`;
          }
          payload.name = 'Error is not an object';
          payload.message = `Error type: ${Object.prototype.toString.call(error)}\nError string: ${errorString}`;
          payload.stack = 'No stack';
        } else {
          payload.name = error.name || 'Unknown error';
          payload.message = error.message || 'Unknown error';
          payload.stack = error.stack || 'No stack';
          payload.sqlQuery = error.query;
          payload.sqlCode = error.code;
          payload.sqlParameters = error.parameters;
          payload.sqlHint = error.hint;
        }
        return from(this.errorService.add(payload)).pipe(
          map(() => {
            throw error;
          })
        );
      })
    );
  }
}
