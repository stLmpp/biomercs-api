import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreStatusRepository } from './score-status.repository';
import { ScoreStatusService } from './score-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScoreStatusRepository])],
  providers: [ScoreStatusService],
  exports: [ScoreStatusService],
})
export class ScoreStatusModule {}
