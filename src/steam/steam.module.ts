import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { SteamController } from './steam.controller';
import { SteamService } from './steam.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SteamProfileRepository } from './steam-profile.repository';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [TypeOrmModule.forFeature([SteamProfileRepository]), HttpModule, forwardRef(() => PlayerModule)],
  controllers: [SteamController],
  providers: [SteamService],
  exports: [SteamService],
})
export class SteamModule {}
