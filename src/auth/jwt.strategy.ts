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
    const user = await this.userService.getById(payload.id);
    if (!user || !user.canLogin()) {
      throw new UnauthorizedException();
    }
    const { salt, password } = await this.userService.getPasswordAndSalt(payload.id);
    user.salt = salt;
    user.password = password;
    if (user.password !== payload.password) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
