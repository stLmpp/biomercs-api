import { Module } from '@nestjs/common';
import { CharacterCostumeService } from './character-costume.service';
import { CharacterCostumeController } from './character-costume.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterCostumeRepository } from './character-costume.repository';
import { MapperModule } from '../../mapper/mapper.module';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterCostumeRepository]), MapperModule],
  providers: [CharacterCostumeService],
  controllers: [CharacterCostumeController],
  exports: [CharacterCostumeService],
})
export class CharacterCostumeModule {}
