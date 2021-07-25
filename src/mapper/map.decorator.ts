import { Type } from '../util/type';
import { applyDecorators, CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { mapperService } from './mapper.service';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export class MapInterceptor<From, To> implements NestInterceptor {
  constructor(private from: Type<From>, private to: Type<To>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map(data => {
        if (mapperService.has(this.from, this.to)) {
          return mapperService.map(this.from, this.to, data);
        }
        return data;
      })
    );
  }

  static store = new Map<Type, Map<Type, MapInterceptor<any, any>>>();

  static instance<From, To>(from: Type<From>, to: Type<To>): MapInterceptor<From, To> {
    let interceptorMap = MapInterceptor.store.get(from);
    if (!interceptorMap) {
      interceptorMap = new Map();
      MapInterceptor.store.set(from, interceptorMap);
    }
    let interceptor = interceptorMap.get(to);
    if (!interceptor) {
      interceptor = new MapInterceptor<From, To>(from, to);
      interceptorMap.set(to, interceptor);
    }
    return interceptor;
  }
}

export function MapResponse<From, To>(from: Type<From>, to: Type<To>, options?: ApiResponseOptions): MethodDecorator {
  return applyDecorators(
    UseInterceptors(MapInterceptor.instance(from, to)),
    ApiResponse({ status: 200, type: to, ...options })
  );
}
