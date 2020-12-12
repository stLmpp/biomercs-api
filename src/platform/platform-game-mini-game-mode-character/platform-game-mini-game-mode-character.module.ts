import { Module } from '@nestjs/common';
import { PlatformGameMiniGameModeCharacterService } from './platform-game-mini-game-mode-character.service';
import { PlatformGameMiniGameModeCharacterController } from './platform-game-mini-game-mode-character.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformGameMiniGameModeCharacterRepository } from './platform-game-mini-game-mode-character.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformGameMiniGameModeCharacterRepository])],
  providers: [PlatformGameMiniGameModeCharacterService],
  controllers: [PlatformGameMiniGameModeCharacterController],
  exports: [PlatformGameMiniGameModeCharacterService],
})
export class PlatformGameMiniGameModeCharacterModule {}
