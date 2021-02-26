import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isNil } from 'st-utils';
import { IsNumber as _IsNumber } from 'class-validator';

export function IsNumber(): PropertyDecorator {
  return applyDecorators(
    Transform(id => !isNil(id) ? +id : id),
    _IsNumber()
  );
}
