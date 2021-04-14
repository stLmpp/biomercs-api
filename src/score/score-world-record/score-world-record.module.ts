import { forwardRef, Module } from '@nestjs/common';
import { ScoreWorldRecordService } from './score-world-record.service';
import { ScoreWorldRecordController } from './score-world-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreWorldRecordRepository } from './score-world-record.repository';
import { ScoreWorldRecordCharacter } from './score-world-record-character.entity';
import { ScoreModule } from '../score.module';
import { ModeModule } from '../../mode/mode.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreWorldRecordRepository, ScoreWorldRecordCharacter]),
    forwardRef(() => ScoreModule),
    ModeModule,
  ],
  providers: [ScoreWorldRecordService],
  controllers: [ScoreWorldRecordController],
  exports: [ScoreWorldRecordService],
})
export class ScoreWorldRecordModule {}
