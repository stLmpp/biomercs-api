import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { GameMiniGameModule } from './game-mini-game/game-mini-game.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameRepository]), GameMiniGameModule, PlayerModule],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService, GameMiniGameModule],
})
export class GameModule {}
