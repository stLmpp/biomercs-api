import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Params } from '../type/params';

export function ApiOrderBy(required = false): MethodDecorator {
  return applyDecorators(ApiQuery({ name: Params.orderBy, description: 'Order by', required, type: String }));
}

export function ApiOrderByDirection(required = false): MethodDecorator {
  return applyDecorators(
    ApiQuery({ name: Params.orderByDirection, description: 'Order direction', required, enum: ['ASC', 'DESC'] })
  );
}

export function ApiOrderByAndDir(required = false): MethodDecorator {
  return applyDecorators(ApiOrderBy(required), ApiOrderByDirection(required));
}
