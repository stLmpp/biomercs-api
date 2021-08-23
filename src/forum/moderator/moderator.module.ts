import { Module } from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { ModeratorController } from './moderator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeratorRepository } from './moderator.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ModeratorRepository])],
  providers: [ModeratorService],
  controllers: [ModeratorController],
})
export class ModeratorModule {}
