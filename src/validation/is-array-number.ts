import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsArray } from 'class-validator';
import { isString } from 'st-utils';

export function IsArrayNumber(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => (value?.length ? value.map(Number) : value)),
    IsArray()
  );
}

export function IsArrayNumberQuery(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => (isString(value) ? value.split(',').map(Number) : value)),
    IsArray()
  );
}
