import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRepository } from './game.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GameRepository])],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
