import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_TYPEORM_CONFIG } from './environment/db.config';
import { CoreModule } from './core/core.module';
import { ValidationModule } from './validation/validation.module';
import { HandleErrorFilter } from './environment/handle-error.filter';
import { APP_FILTER } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { environment } from './environment/environment';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PlayerModule } from './player/player.module';
import { SteamModule } from './steam/steam.module';
import { AuthSubscriber } from './auth/auth-subscriber';
import { RegionModule } from './region/region.module';
import { GameModule } from './game/game.module';
import { PlatformGameMiniGameModule } from './platform-game-mode/platform-game-mini-game.module';
import { MiniGameModule } from './mini-game/mini-game.module';
import { GameMiniGameModule } from './game-mini-game/game-mini-game.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_TYPEORM_CONFIG),
    MailerModule.forRoot({
      transport: {
        service: environment.get('MAIL_SERVICE'),
        auth: {
          user: environment.get('MAIL'),
          pass: environment.get('MAIL_PASS'),
        },
      },
      defaults: {
        from: `"Biomercs" <${environment.get('MAIL')}>`,
      },
      template: {
        dir: join(__dirname, '..', '..', 'mail', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '..', '..', 'biomercs-v2', 'dist', 'biomercs-v2'),
    // }),
    CoreModule,
    ValidationModule,
    UserModule,
    AuthModule,
    PlayerModule,
    SteamModule,
    RegionModule,
    GameModule,
    MiniGameModule,
    GameMiniGameModule,
    PlatformGameMiniGameModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HandleErrorFilter,
    },
    AuthSubscriber,
  ],
})
export class AppModule {}
