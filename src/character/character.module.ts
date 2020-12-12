import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterRepository } from './character.repository';
import { CharacterCostumeModule } from './character-costume/character-costume.module';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterRepository]), CharacterCostumeModule],
  providers: [CharacterService],
  controllers: [CharacterController],
  exports: [CharacterService, CharacterCostumeModule],
})
export class CharacterModule {}
