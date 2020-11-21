import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { User } from '../user/user.entity';
import { RequestService } from '../core/request.service';
import { updatedBy } from './last-updated-by.pipe';

export function updateCreatedBy<T>(value: T, user: User | number = -1): T {
  return updatedBy(value, user, 'createdBy');
}

@Injectable()
export class CreatedByPipe implements PipeTransform {
  constructor(private requestService: RequestService) {}

  transform(value: any, { type }: ArgumentMetadata): any {
    if (type !== 'body') return value;
    return updateCreatedBy(value, this.requestService.user);
  }
}
