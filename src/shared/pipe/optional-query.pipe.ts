import { Injectable, PipeTransform } from '@nestjs/common';
import { isDate, isNumber } from 'st-utils';
import { isValid } from 'date-fns';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';

@Injectable()
export class OptionalQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (
      ((isNumber(value) || metadata.metatype === Number) && isNaN(value)) ||
      (value !== '' && !value) ||
      ((metadata.metatype === Date || isDate(value)) && !isValid(value))
    ) {
      return null;
    }
    return value;
  }
}
