import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { environment } from '../environment/environment';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environment.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    if (!payload?.id || !payload?.password) {
      throw new UnauthorizedException();
    }
    let user: User;
    try {
      user = await this.userService.findByIdWithPasswordAndSaltOrFail(payload.id);
    } catch {
      throw new UnauthorizedException();
    }
    if (!user.canLogin()) {
      throw new UnauthorizedException();
    }
    if (user.password !== payload.password) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
