import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDate as _IsDate } from 'class-validator';

export function IsDate(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => (value ? new Date(value) : value)),
    _IsDate()
  );
}
