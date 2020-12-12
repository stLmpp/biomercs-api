import { Module } from '@nestjs/common';
import { ModeService } from './mode.service';
import { ModeController } from './mode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeRepository } from './mode.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ModeRepository])],
  providers: [ModeService],
  controllers: [ModeController],
  exports: [ModeService],
})
export class ModeModule {}
