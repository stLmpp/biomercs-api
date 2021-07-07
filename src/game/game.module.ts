import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';
import { GameMiniGameModule } from './game-mini-game/game-mini-game.module';
import { PlayerModule } from '../player/player.module';
import { MapperModule } from '../mapper/mapper.module';
import { MapperService } from '../mapper/mapper.service';
import { Game } from './game.entity';
import { GameViewModel } from './game.view-model';

@Module({
  imports: [TypeOrmModule.forFeature([GameRepository]), GameMiniGameModule, PlayerModule, MapperModule],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService, GameMiniGameModule],
})
export class GameModule {
  constructor(private mapperService: MapperService) {
    this.mapperService.create(Game, GameViewModel);
  }
}
