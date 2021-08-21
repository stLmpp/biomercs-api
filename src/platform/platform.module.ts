import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformRepository } from './platform.repository';
import { PlatformGameMiniGameModule } from './platform-game-mini-game/platform-game-mini-game.module';
import { PlatformGameMiniGameModeModule } from './platform-game-mini-game-mode/platform-game-mini-game-mode.module';
import { PlatformGameMiniGameModeStageModule } from './platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.module';
import { PlatformGameMiniGameModeCharacterCostumeModule } from './platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.module';
import { PlayerModule } from '../player/player.module';
import { MapperModule } from '../mapper/mapper.module';
import { EnvironmentModule } from '../environment/environment.module';
import { PlatformInputTypeModule } from './platform-input-type/platform-input-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlatformRepository]),
    PlatformGameMiniGameModule,
    PlatformGameMiniGameModeModule,
    PlatformGameMiniGameModeStageModule,
    PlatformGameMiniGameModeCharacterCostumeModule,
    PlayerModule,
    MapperModule,
    EnvironmentModule,
    PlatformInputTypeModule,
  ],
  providers: [PlatformService],
  controllers: [PlatformController],
  exports: [
    PlatformService,
    PlatformGameMiniGameModule,
    PlatformGameMiniGameModeModule,
    PlatformGameMiniGameModeStageModule,
    PlatformGameMiniGameModeCharacterCostumeModule,
  ],
})
export class PlatformModule {}
