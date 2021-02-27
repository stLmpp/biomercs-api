import { environment } from '../environment/environment';
import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { getUserFromContext } from './auth-user.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const user = getUserFromContext(context);
    if (!user?.admin) {
      throw new ForbiddenException('Access denied');
    }
    return true;
  }
}

export function ApiAdmin(): any {
  const decorators = environment.config('USE_AUTH')
    ? [
        UseGuards(AdminGuard),
        ApiForbiddenResponse({ description: 'Access denied' }),
        ApiOperation({ description: 'Requires admin privileges' }),
      ]
    : [];
  return applyDecorators(...decorators);
}
