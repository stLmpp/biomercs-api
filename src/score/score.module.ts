import { forwardRef, Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreRepository } from './score.repository';
import { ScorePlayerModule } from './score-player/score-player.module';
import { ScoreApprovalModule } from './score-approval/score-approval.module';
import { ScoreApprovalMotiveModule } from './score-approval-motive/score-approval-motive.module';
import { PlatformGameMiniGameModeStageModule } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.module';
import { ModeModule } from '../mode/mode.module';
import { MapperModule } from '../mapper/mapper.module';
import { PlatformGameMiniGameModeCharacterCostumeModule } from '../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.module';
import { PlayerModule } from '../player/player.module';
import { StageModule } from '../stage/stage.module';
import { ScoreWorldRecordModule } from './score-world-record/score-world-record.module';
import { ScoreChangeRequestModule } from './score-change-request/score-change-request.module';
import { ScoreGateway } from './score.gateway';
import { MailModule } from '../mail/mail.module';
import { ScoreStatusModule } from './score-status/score-status.module';
import { EnvironmentModule } from '../environment/environment.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreRepository]),
    ScorePlayerModule,
    ScoreApprovalModule,
    ScoreApprovalMotiveModule,
    PlatformGameMiniGameModeStageModule,
    ModeModule,
    MapperModule,
    PlatformGameMiniGameModeCharacterCostumeModule,
    forwardRef(() => PlayerModule),
    StageModule,
    forwardRef(() => ScoreWorldRecordModule),
    ScoreChangeRequestModule,
    MailModule,
    ScoreStatusModule,
    EnvironmentModule,
    forwardRef(() => NotificationModule),
    UserModule,
  ],
  providers: [ScoreService, ScoreGateway],
  controllers: [ScoreController],
  exports: [
    ScoreService,
    ScorePlayerModule,
    ScoreApprovalModule,
    ScoreApprovalMotiveModule,
    ScoreWorldRecordModule,
    ScoreGateway,
  ],
})
export class ScoreModule {}
