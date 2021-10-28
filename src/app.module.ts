import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './environment/typeorm.config';
import { ValidationModule } from './validation/validation.module';
import { HandleErrorFilter } from './error/handle-error.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { resolve } from 'path';
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
import { ErrorModule } from './error/error.module';
import { ErrorInterceptor } from './error/error.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { EnvironmentModule } from './environment/environment.module';
import { MailerConfig } from './mail/mailer.config';
import { InputTypeModule } from './input-type/input-type.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ imports: [EnvironmentModule], useExisting: TypeOrmConfig }),
    MailerModule.forRootAsync({ imports: [MailModule], useExisting: MailerConfig }),
    ServeStaticModule.forRoot({
      rootPath: resolve(process.cwd() + '/frontend'),
    }),
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
    ErrorModule,
    ScheduleModule.forRoot(),
    EnvironmentModule,
    InputTypeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HandleErrorFilter },
    AuthSubscriber,
    { provide: APP_INTERCEPTOR, useClass: RateLimiterInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
  ],
})
export class AppModule {}
