import { isNil } from 'st-utils';

export function random(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isNotNil<T>(value: T): value is NonNullable<T> {
  return !isNil(value);
}
