import { Injectable } from '@nestjs/common';
import { CharacterCostumeRepository } from './character-costume.repository';
import { CharacterCostumeAddDto, CharacterCostumeUpdateDto } from './character-costume.dto';
import { CharacterCostume } from './character-costume.entity';

@Injectable()
export class CharacterCostumeService {
  constructor(private characterCostumeRepository: CharacterCostumeRepository) {}

  async add(dto: CharacterCostumeAddDto): Promise<CharacterCostume> {
    return this.characterCostumeRepository.save(new CharacterCostume().extendDto(dto));
  }

  async update(idCharacterCostume: number, dto: CharacterCostumeUpdateDto): Promise<CharacterCostume> {
    const characterCostume = await this.characterCostumeRepository.findOneOrFail(idCharacterCostume);
    await this.characterCostumeRepository.update(idCharacterCostume, dto);
    return new CharacterCostume().extendDto({ ...characterCostume, ...dto });
  }
}
