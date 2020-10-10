import { TransformationType, TransformOptions } from 'class-transformer';

declare module 'class-transformer/decorators' {
  function Transform(
    transformFn: (value: any, obj: any, transformationType: TransformationType) => any,
    options?: TransformOptions
  ): PropertyDecorator;
}
