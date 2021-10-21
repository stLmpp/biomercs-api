import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from '../user/user.service';
import { Environment } from '../environment/environment';
import { AuthGateway } from './auth.gateway';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private environment: Environment, private authGateway: AuthGateway) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environment.get('JWT_SECRET'),
    });
  }

  private readonly _useAuth = this.environment.get('USE_AUTH');

  async validate(payload: JwtPayload): Promise<User> {
    if (!this._useAuth) {
      return { id: -1 } as User;
    }
    if (!payload?.id || !payload?.password) {
      throw new UnauthorizedException();
    }
    let user: User;
    try {
      user = await this.userService.findByIdWithPasswordAndSaltOrFail(payload.id);
    } catch {
      throw new UnauthorizedException();
    }
    if (!user.canLogin() || user.password !== payload.password) {
      throw new UnauthorizedException();
    }
    user.lastOnline = new Date();
    await this.userService.update(user.id, { lastOnline: user.lastOnline });
    this.authGateway.sendUserOnline({ id: user.id, idPlayer: user.player.id, personaName: user.player.personaName });
    return user;
  }
}
