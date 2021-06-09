import { forwardRef, Module } from '@nestjs/common';
import { ModeService } from './mode.service';
import { ModeController } from './mode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeRepository } from './mode.repository';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [TypeOrmModule.forFeature([ModeRepository]), forwardRef(() => PlayerModule)],
  providers: [ModeService],
  controllers: [ModeController],
  exports: [ModeService],
})
export class ModeModule {}
