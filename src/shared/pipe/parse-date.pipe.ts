import { Injectable, PipeTransform } from '@nestjs/common';
import { isDate, isValid } from 'date-fns';

export function parseDate(date: string): Date | null {
  if (!date || !isDate(date) || (isDate(date) && !isValid(date))) {
    return null;
  }
  return new Date(date);
}

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string): Date | null {
    return parseDate(value);
  }
}
