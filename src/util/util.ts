import camelcase from 'camelcase';

export function camelCase(str: string): string {
  return camelcase(str);
}

export function random(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
