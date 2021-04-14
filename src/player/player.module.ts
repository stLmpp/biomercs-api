import { forwardRef, Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerRepository } from './player.repository';
import { SteamModule } from '../steam/steam.module';
import { RegionModule } from '../region/region.module';
import { MapperModule } from '../mapper/mapper.module';
import { MapperService } from '../mapper/mapper.service';
import { Player } from './player.entity';
import { PlayerViewModel, PlayerWithRegionViewModel } from './player.view-model';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerRepository]), forwardRef(() => SteamModule), RegionModule, MapperModule],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {
  constructor(private mapperService: MapperService) {
    this.mapperService.create(Player, PlayerViewModel);
    this.mapperService.create(Player, PlayerWithRegionViewModel);
  }
}
