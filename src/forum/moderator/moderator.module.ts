import { Module } from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { ModeratorController } from './moderator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeratorRepository } from './moderator.repository';
import { MapperModule } from '../../mapper/mapper.module';
import { EnvironmentModule } from '../../environment/environment.module';

@Module({
  imports: [TypeOrmModule.forFeature([ModeratorRepository]), MapperModule, EnvironmentModule],
  providers: [ModeratorService],
  controllers: [ModeratorController],
  exports: [ModeratorService],
})
export class ModeratorModule {}
