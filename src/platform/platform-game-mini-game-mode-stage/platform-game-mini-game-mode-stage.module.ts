import { Module } from '@nestjs/common';
import { PlatformGameMiniGameModeStageService } from './platform-game-mini-game-mode-stage.service';
import { PlatformGameMiniGameModeStageController } from './platform-game-mini-game-mode-stage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformGameMiniGameModeStageRepository } from './platform-game-mini-game-mode-stage.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformGameMiniGameModeStageRepository])],
  providers: [PlatformGameMiniGameModeStageService],
  controllers: [PlatformGameMiniGameModeStageController],
  exports: [PlatformGameMiniGameModeStageService],
})
export class PlatformGameMiniGameModeStageModule {}
