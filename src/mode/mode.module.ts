import { forwardRef, Module } from '@nestjs/common';
import { ModeService } from './mode.service';
import { ModeController } from './mode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeRepository } from './mode.repository';
import { PlayerModule } from '../player/player.module';
import { MapperModule } from '../mapper/mapper.module';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModeRepository]),
    forwardRef(() => PlayerModule),
    MapperModule,
    EnvironmentModule,
  ],
  providers: [ModeService],
  controllers: [ModeController],
  exports: [ModeService],
})
export class ModeModule {}
