import { Module } from '@nestjs/common';
import { PlatformGameMiniGameModeStageService } from './platform-game-mini-game-mode-stage.service';
import { PlatformGameMiniGameModeStageController } from './platform-game-mini-game-mode-stage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformGameMiniGameModeStageRepository } from './platform-game-mini-game-mode-stage.repository';
import { PlatformGameMiniGameModeModule } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformGameMiniGameModeStageRepository]), PlatformGameMiniGameModeModule],
  providers: [PlatformGameMiniGameModeStageService],
  controllers: [PlatformGameMiniGameModeStageController],
  exports: [PlatformGameMiniGameModeStageService],
})
export class PlatformGameMiniGameModeStageModule {}
