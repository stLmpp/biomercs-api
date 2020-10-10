import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDate as _IsDate } from 'class-validator';

export function IsDate(): PropertyDecorator {
  return applyDecorators(
    Transform(data => (data ? new Date(data) : data)),
    _IsDate()
  );
}
