import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { GameMiniGameModule } from './game-mini-game/game-mini-game.module';
import { PlayerModule } from '../player/player.module';
import { MapperModule } from '../mapper/mapper.module';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameRepository]),
    GameMiniGameModule,
    PlayerModule,
    MapperModule,
    EnvironmentModule,
  ],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService, GameMiniGameModule],
})
export class GameModule {}
