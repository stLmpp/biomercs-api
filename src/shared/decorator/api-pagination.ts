import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationLinks, PaginationMeta } from '../view-model/pagination.view-model';
import { Type } from '../../util/type';

function paginateType(type: Type, name?: string): Type<Pagination<any>> {
  class Paginate implements Pagination<any> {
    @ApiProperty()
    links!: PaginationLinks;

    @ApiProperty()
    meta!: PaginationMeta;

    @ApiProperty({ type, isArray: true })
    items!: any[];
  }
  name = name ?? `Pagination${type.name}`;
  Object.defineProperty(Paginate, 'name', { value: name });
  return Paginate;
}

export function ApiPagination(type: Type): MethodDecorator {
  return applyDecorators(ApiOkResponse({ type: paginateType(type) }));
}
