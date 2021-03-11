import { Module } from '@nestjs/common';
import { ScoreWorldRecordScheduleService } from './score-world-record-schedule.service';
import { ScoreWorldRecordScheduleController } from './score-world-record-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreWorldRecordScheduleRepository } from './score-world-record-schedule.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ScoreWorldRecordScheduleRepository])],
  providers: [ScoreWorldRecordScheduleService],
  controllers: [ScoreWorldRecordScheduleController],
  exports: [ScoreWorldRecordScheduleService],
})
export class ScoreWorldRecordScheduleModule {}
