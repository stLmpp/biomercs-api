import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformRepository } from './platform.repository';
import { PlatformGameMiniGameModule } from './platform-game-mini-game/platform-game-mini-game.module';
import { PlatformGameMiniGameModeModule } from './platform-game-mini-game-mode/platform-game-mini-game-mode.module';
import { PlatformGameMiniGameModeStageModule } from './platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.module';
import { PlatformGameMiniGameModeCharacterModule } from './platform-game-mini-game-mode-character/platform-game-mini-game-mode-character.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlatformRepository]),
    PlatformGameMiniGameModule,
    PlatformGameMiniGameModeModule,
    PlatformGameMiniGameModeStageModule,
    PlatformGameMiniGameModeCharacterModule,
  ],
  providers: [PlatformService],
  controllers: [PlatformController],
  exports: [
    PlatformService,
    PlatformGameMiniGameModule,
    PlatformGameMiniGameModeModule,
    PlatformGameMiniGameModeStageModule,
    PlatformGameMiniGameModeCharacterModule,
  ],
})
export class PlatformModule {}
