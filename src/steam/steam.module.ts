import { forwardRef, Module } from '@nestjs/common';
import { SteamController } from './steam.controller';
import { SteamService } from './steam.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SteamProfileRepository } from './steam-profile.repository';
import { PlayerModule } from '../player/player.module';
import { MapperModule } from '../mapper/mapper.module';
import { ScoreModule } from '../score/score.module';
import { RegionModule } from '../region/region.module';
import { SteamGateway } from './steam.gateway';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([SteamProfileRepository]),
    HttpModule,
    forwardRef(() => PlayerModule),
    MapperModule,
    ScoreModule,
    RegionModule,
  ],
  controllers: [SteamController],
  providers: [SteamService, SteamGateway],
  exports: [SteamService],
})
export class SteamModule {}
