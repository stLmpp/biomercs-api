import { Module } from '@nestjs/common';
import { PlatformGameMiniGameModeService } from './platform-game-mini-game-mode.service';
import { PlatformGameMiniGameModeController } from './platform-game-mini-game-mode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformGameMiniGameModeRepository } from './platform-game-mini-game-mode.repository';
import { PlatformGameMiniGameModule } from '../platform-game-mini-game/platform-game-mini-game.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformGameMiniGameModeRepository]), PlatformGameMiniGameModule],
  providers: [PlatformGameMiniGameModeService],
  controllers: [PlatformGameMiniGameModeController],
  exports: [PlatformGameMiniGameModeService],
})
export class PlatformGameMiniGameModeModule {}
