import { Module } from '@nestjs/common';
import { MiniGameService } from './mini-game.service';
import { MiniGameController } from './mini-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniGameRepository } from './mini-game.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MiniGameRepository])],
  providers: [MiniGameService],
  controllers: [MiniGameController],
  exports: [MiniGameService],
})
export class MiniGameModule {}
