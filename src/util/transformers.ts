import { ValueTransformer } from 'typeorm';

const simpleArrayNumber: ValueTransformer = Object.freeze({
  from(value: string[]): number[] {
    return value.map(Number);
  },
  to(value: any): any {
    return value;
  },
});

class SimpleArrayValueTransformers {
  static readonly number = simpleArrayNumber;
}

export class ValueTransformers {
  static readonly SimpleArray = SimpleArrayValueTransformers;
}
