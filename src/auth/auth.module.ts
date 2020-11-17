import { Global, Module } from '@nestjs/common';
import { environment } from '../environment/environment';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthConfirmationModule } from './auth-confirmation/auth-confirmation.module';
import { AuthController } from './auth.controller';
import { PlayerModule } from '../player/player.module';
import { AuthGateway } from './auth.gateway';
import { SteamModule } from '../steam/steam.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: environment.get('JWT_SECRET'),
      signOptions: {
        expiresIn: environment.get('JWT_EXPIRES_IN'),
      },
    }),
    UserModule,
    AuthConfirmationModule,
    PlayerModule,
    SteamModule,
  ],
  providers: [JwtStrategy, AuthService, AuthGateway],
  exports: [AuthService, PassportModule],
  controllers: [AuthController],
})
@Global()
export class AuthModule {}
