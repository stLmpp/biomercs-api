import { Module } from '@nestjs/common';
import { PlatformGameMiniGameService } from './platform-game-mini-game.service';
import { PlatformGameMiniGameController } from './platform-game-mini-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformGameMiniGameRepository } from './platform-game-mini-game.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformGameMiniGameRepository])],
  providers: [PlatformGameMiniGameService],
  controllers: [PlatformGameMiniGameController],
})
export class PlatformGameMiniGameModule {}
