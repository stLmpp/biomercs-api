import { Global, Module } from '@nestjs/common';
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
import { MapperModule } from '../mapper/mapper.module';
import { MailModule } from '../mail/mail.module';
import { EncryptorModule } from '../encryptor/encryptor.module';
import { EnvironmentModule } from '../environment/environment.module';
import { JwtOptions } from './jwt-options';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [EnvironmentModule],
      useExisting: JwtOptions,
    }),
    UserModule,
    AuthConfirmationModule,
    PlayerModule,
    SteamModule,
    MapperModule,
    MailModule,
    EncryptorModule,
    EnvironmentModule,
  ],
  providers: [JwtStrategy, AuthService, AuthGateway, JwtOptions],
  exports: [AuthService, PassportModule, JwtOptions],
  controllers: [AuthController],
})
@Global()
export class AuthModule {}
