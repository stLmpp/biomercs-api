import { Injectable } from '@nestjs/common';
import { CharacterRepository } from './character.repository';
import { Character } from './character.entity';
import { CharacterAddDto, CharacterPlatformsGamesMiniGamesModesDto, CharacterUpdateDto } from './character.dto';

@Injectable()
export class CharacterService {
  constructor(private characterRepository: CharacterRepository) {}

  async findById(idCharacter: number): Promise<Character> {
    return this.characterRepository.findOneOrFail(idCharacter);
  }

  async add(dto: CharacterAddDto): Promise<Character> {
    return this.characterRepository.save(new Character().extendDto(dto));
  }

  async update(idCharacter: number, dto: CharacterUpdateDto): Promise<Character> {
    await this.characterRepository.update(idCharacter, dto);
    return this.characterRepository.findOneOrFail(idCharacter);
  }

  async findByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<Character[]> {
    return this.characterRepository.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode);
  }

  async findByIdPlatformsGamesMiniGamesModes(dto: CharacterPlatformsGamesMiniGamesModesDto): Promise<Character[]> {
    return this.characterRepository.findByIdPlatformsGamesMiniGamesModes(dto);
  }
}
