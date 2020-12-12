import { Module } from '@nestjs/common';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StageRepository } from './stage.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StageRepository])],
  providers: [StageService],
  controllers: [StageController],
  exports: [StageService],
})
export class StageModule {}
