import { Injectable, PipeTransform } from '@nestjs/common';
import { isNumber } from 'st-utils';

@Injectable()
export class OptionalQueryPipe implements PipeTransform {
  transform(value: any): any {
    if ((isNumber(value) && isNaN(value)) || (value !== '' && !value)) {
      return null;
    }
    return value;
  }
}
