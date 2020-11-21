import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isNumber, isArray, isObject } from 'lodash';
import { User } from '../user/user.entity';
import { RequestService } from '../core/request.service';

export function updatedBy<T>(value: T, user: User | number = -1, property: 'createdBy' | 'lastUpdatedBy'): T {
  if (!value) return value;
  const idUser = isNumber(user) ? user : user.id;
  if (isArray(value)) {
    return value.map(val => {
      (val as any)[property] = idUser;
      return val;
    }) as any;
  } else if (isObject(value)) {
    (value as any)[property] = idUser;
  }
  return value;
}

export function updateLastUpdatedBy<T>(value: T, user: User | number = -1): T {
  return updatedBy(value, user, 'lastUpdatedBy');
}

@Injectable()
export class UpdatedByPipe implements PipeTransform {
  constructor(private requestService: RequestService) {}

  transform(value: any, { type }: ArgumentMetadata): any {
    if (type !== 'body') return value;
    return updateLastUpdatedBy(value, this.requestService.user);
  }
}
