import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { RouteParamEnum } from '../type/route-param.enum';

export function ApiOrderBy(required = false): any {
  return applyDecorators(
    ApiQuery({ name: RouteParamEnum.orderBy, description: 'Ordernar por', required, type: String })
  );
}

export function ApiOrderByDirection(required = false): any {
  return applyDecorators(
    ApiQuery({ name: RouteParamEnum.orderByDirection, description: 'Ordenação', required, enum: ['ASC', 'DESC'] })
  );
}

export function ApiOrderByAndDir(required = false): any {
  return applyDecorators(ApiOrderBy(required), ApiOrderByDirection(required));
}
