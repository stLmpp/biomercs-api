import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from '../user/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  constructor(@Inject(REQUEST) public request: Request) {}

  get user(): User {
    return (this.request.user as User) ?? ({ id: -1 } as User);
  }
}
