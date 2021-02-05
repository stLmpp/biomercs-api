import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

export function IsArrayNumber(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => (value?.length ? value.map(Number) : value)),
    IsArray()
  );
}
