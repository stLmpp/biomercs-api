import { Module } from '@nestjs/common';
import { ScorePlayerService } from './score-player.service';
import { ScorePlayerController } from './score-player.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScorePlayerRepository } from './score-player.repository';
import { PlatformGameMiniGameModeCharacterCostumeModule } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.module';
import { PlatformInputTypeModule } from '../../platform/platform-input-type/platform-input-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScorePlayerRepository]),
    PlatformGameMiniGameModeCharacterCostumeModule,
    PlatformInputTypeModule,
  ],
  providers: [ScorePlayerService],
  controllers: [ScorePlayerController],
  exports: [ScorePlayerService],
})
export class ScorePlayerModule {}
