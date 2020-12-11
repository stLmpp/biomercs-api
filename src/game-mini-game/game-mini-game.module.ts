import { Module } from '@nestjs/common';
import { GameMiniGameService } from './game-mini-game.service';
import { GameMiniGameController } from './game-mini-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameMiniGameRepository } from './game-mini-game.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GameMiniGameRepository])],
  providers: [GameMiniGameService],
  controllers: [GameMiniGameController],
  exports: [GameMiniGameService],
})
export class GameMiniGameModule {}
