import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { coerceBooleanProperty } from 'st-utils';
import { IsBoolean as _IsBoolean } from 'class-validator';

export function IsBoolean(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => coerceBooleanProperty(value)),
    _IsBoolean()
  );
}
