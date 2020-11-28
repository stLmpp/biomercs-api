import { forwardRef, Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerRepository } from './player.repository';
import { SteamModule } from '../steam/steam.module';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerRepository]), forwardRef(() => SteamModule), RegionModule],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
