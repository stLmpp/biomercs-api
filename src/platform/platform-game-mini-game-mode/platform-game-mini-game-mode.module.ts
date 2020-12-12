import { Module } from '@nestjs/common';
import { PlatformGameMiniGameModeService } from './platform-game-mini-game-mode.service';
import { PlatformGameMiniGameModeController } from './platform-game-mini-game-mode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformGameMiniGameModeRepository } from './platform-game-mini-game-mode.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformGameMiniGameModeRepository])],
  providers: [PlatformGameMiniGameModeService],
  controllers: [PlatformGameMiniGameModeController],
  exports: [PlatformGameMiniGameModeService],
})
export class PlatformGameMiniGameModeModule {}
