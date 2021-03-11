import { forwardRef, Module } from '@nestjs/common';
import { ScoreWorldRecordService } from './score-world-record.service';
import { ScoreWorldRecordController } from './score-world-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreWorldRecordRepository } from './score-world-record.repository';
import { ScoreWorldRecordCharacter } from './score-world-record-character.entity';
import { ScoreWorldRecordScheduleModule } from '../score-world-record-schedule/score-world-record-schedule.module';
import { ScoreModule } from '../score.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreWorldRecordRepository, ScoreWorldRecordCharacter]),
    ScoreWorldRecordScheduleModule,
    forwardRef(() => ScoreModule),
  ],
  providers: [ScoreWorldRecordService],
  controllers: [ScoreWorldRecordController],
  exports: [ScoreWorldRecordService],
})
export class ScoreWorldRecordModule {}
