import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { getUserFromContext } from './auth-user.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private environment: Environment) {}

  private _useAuth = this.environment.get('USE_AUTH');

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (!this._useAuth) {
      return true;
    }
    const user = getUserFromContext(context);
    if (!user?.admin) {
      throw new ForbiddenException('Access denied');
    }
    return true;
  }
}
