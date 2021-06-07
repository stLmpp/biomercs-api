import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_TYPEORM_CONFIG } from './environment/database';
import { CoreModule } from './core/core.module';
import { ValidationModule } from './validation/validation.module';
import { HandleErrorFilter } from './environment/handle-error.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { environment } from './environment/environment';
import { resolve } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PlayerModule } from './player/player.module';
import { SteamModule } from './steam/steam.module';
import { AuthSubscriber } from './auth/auth-subscriber';
import { RegionModule } from './region/region.module';
import { GameModule } from './game/game.module';
import { MiniGameModule } from './mini-game/mini-game.module';
import { ModeModule } from './mode/mode.module';
import { StageModule } from './stage/stage.module';
import { CharacterModule } from './character/character.module';
import { PlatformModule } from './platform/platform.module';
import { ScoreModule } from './score/score.module';
import { MapperModule } from './mapper/mapper.module';
import { UrlMetadataModule } from './url-metadata/url-metadata.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ContactModule } from './contact/contact.module';
import { RateLimiterInterceptor, RateLimiterModule } from 'nestjs-rate-limiter';
import { RuleModule } from './rule/rule.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_TYPEORM_CONFIG),
    MailerModule.forRoot({
      transport: {
        service: environment.get('MAIL_SERVICE'),
        auth: {
          user: environment.mail,
          pass: environment.get('MAIL_PASSWORD'),
        },
      },
      defaults: {
        from: `"Biomercs" <${environment.mail}>`,
      },
      template: {
        dir: resolve(process.cwd() + '/mail/templates/'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(process.cwd() + '/frontend'),
    }),
    CoreModule,
    ValidationModule,
    UserModule,
    AuthModule,
    PlayerModule,
    SteamModule,
    RegionModule,
    GameModule,
    MiniGameModule,
    ModeModule,
    StageModule,
    CharacterModule,
    PlatformModule,
    ScoreModule,
    MapperModule,
    UrlMetadataModule,
    ContactModule,
    RateLimiterModule.register({ points: 10 }),
    RuleModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HandleErrorFilter },
    AuthSubscriber,
    { provide: APP_INTERCEPTOR, useClass: RateLimiterInterceptor },
  ],
})
export class AppModule {}
