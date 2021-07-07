import { InternalServerErrorException } from '@nestjs/common';
import { Type } from '../util/type';

export class MapProfileNotFoundError extends InternalServerErrorException {
  constructor(from: Type, to: Type) {
    super(`Map profile not found: From "${from.name}" to "${to.name}"`);
  }
}
