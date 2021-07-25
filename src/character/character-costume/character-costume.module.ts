import { Module } from '@nestjs/common';
import { CharacterCostumeService } from './character-costume.service';
import { CharacterCostumeController } from './character-costume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterCostumeRepository } from './character-costume.repository';
import { MapperModule } from '../../mapper/mapper.module';
import { EnvironmentModule } from '../../environment/environment.module';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterCostumeRepository]), MapperModule, EnvironmentModule],
  providers: [CharacterCostumeService],
  controllers: [CharacterCostumeController],
  exports: [CharacterCostumeService],
})
export class CharacterCostumeModule {}
