import { Module } from '@nestjs/common';
import { PlatformGameMiniGameService } from './platform-game-mini-game.service';
import { PlatformGameMiniGameController } from './platform-game-mini-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformGameMiniGameRepository } from './platform-game-mini-game.repository';
import { GameMiniGameModule } from '../../game/game-mini-game/game-mini-game.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformGameMiniGameRepository]), GameMiniGameModule],
  providers: [PlatformGameMiniGameService],
  controllers: [PlatformGameMiniGameController],
  exports: [PlatformGameMiniGameService],
})
export class PlatformGameMiniGameModule {}
