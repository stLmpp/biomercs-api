import { Global, Module } from '@nestjs/common';
import { environment } from '../environment/environment';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthConfirmationModule } from './auth-confirmation/auth-confirmation.module';
import { AuthController } from './auth.controller';

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
  ],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService, PassportModule, AuthService],
  controllers: [AuthController],
})
@Global()
export class AuthModule {}
