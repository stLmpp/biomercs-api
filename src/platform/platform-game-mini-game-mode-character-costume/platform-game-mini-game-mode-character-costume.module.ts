import { Module } from '@nestjs/common';
import { PlatformGameMiniGameModeCharacterCostumeService } from './platform-game-mini-game-mode-character-costume.service';
import { PlatformGameMiniGameModeCharacterCostumeController } from './platform-game-mini-game-mode-character-costume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformGameMiniGameModeCharacterCostumeRepository } from './platform-game-mini-game-mode-character-costume.repository';
import { PlatformGameMiniGameModeModule } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlatformGameMiniGameModeCharacterCostumeRepository]),
    PlatformGameMiniGameModeModule,
  ],
  providers: [PlatformGameMiniGameModeCharacterCostumeService],
  controllers: [PlatformGameMiniGameModeCharacterCostumeController],
  exports: [PlatformGameMiniGameModeCharacterCostumeService],
})
export class PlatformGameMiniGameModeCharacterCostumeModule {}
