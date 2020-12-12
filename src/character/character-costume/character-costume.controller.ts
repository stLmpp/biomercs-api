import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { CharacterCostumeUpdateDto } from './character-costume.dto';
import { CharacterCostume } from './character-costume.entity';
import { CharacterCostumeService } from './character-costume.service';
import { Params } from '../../shared/type/params';

@ApiAuth()
@ApiTags('Character costume')
@Controller('character-costume')
export class CharacterCostumeController {
  constructor(private characterCostumeService: CharacterCostumeService) {}

  @Patch(`:${Params.idCharacterCostume}`)
  async update(
    @Param(Params.idCharacterCostume) idCharacterCostume: number,
    @Body() dto: CharacterCostumeUpdateDto
  ): Promise<CharacterCostume> {
    return this.characterCostumeService.update(idCharacterCostume, dto);
  }
}
