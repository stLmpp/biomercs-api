import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { isNil } from '@stlmpp/utils';
import { IsNumber as _IsNumber } from 'class-validator';

export function IsNumber(): PropertyDecorator {
  return applyDecorators(
    Transform(id => {
      return !isNil(id) ? +id : id;
    }),
    _IsNumber()
  );
}
