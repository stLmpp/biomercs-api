import { Injectable, PipeTransform } from '@nestjs/common';
import { isNumber } from 'lodash';

@Injectable()
export class OptionalQueryPipe implements PipeTransform {
  transform(value: any): any {
    if (isNumber(value) && isNaN(value)) {
      return null;
    } else if (value !== '' && !value) {
      return null;
    }
    return value;
  }
}
