import { Module } from '@nestjs/common';
import { MiniGameService } from './mini-game.service';
import { MiniGameController } from './mini-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniGameRepository } from './mini-game.repository';
import { PlayerModule } from '../player/player.module';
import { MapperService } from '../mapper/mapper.service';
import { MapperModule } from '../mapper/mapper.module';
import { MiniGame } from './mini-game.entity';
import { MiniGameViewModel } from './mini-game.view-model';

@Module({
  imports: [TypeOrmModule.forFeature([MiniGameRepository]), PlayerModule, MapperModule],
  providers: [MiniGameService],
  controllers: [MiniGameController],
  exports: [MiniGameService],
})
export class MiniGameModule {
  constructor(private mapperService: MapperService) {
    this.mapperService.create(MiniGame, MiniGameViewModel);
  }
}
