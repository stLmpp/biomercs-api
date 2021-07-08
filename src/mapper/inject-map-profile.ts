import { Type } from '../util/type';
import { Inject } from '@nestjs/common';
import { mapperService } from './mapper.service';

export function InjectMapProfile<From, To>(from: Type<From>, to: Type<To>): ParameterDecorator {
  return Inject(mapperService.get(from, to).token);
}
