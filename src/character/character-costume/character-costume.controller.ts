import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { CharacterCostumeUpdateDto } from './character-costume.dto';
import { CharacterCostume } from './character-costume.entity';
import { CharacterCostumeService } from './character-costume.service';
import { Params } from '../../shared/type/params';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { CharacterCostumeViewModel } from './character-costume.view-model';
import { MapProfile } from '../../mapper/map-profile';

@ApiAuth()
@ApiTags('Character costume')
@Controller('character-costume')
export class CharacterCostumeController {
  constructor(
    private characterCostumeService: CharacterCostumeService,
    @InjectMapProfile(CharacterCostume, CharacterCostumeViewModel)
    private mapProfile: MapProfile<CharacterCostume, CharacterCostumeViewModel>
  ) {}

  @Patch(`:${Params.idCharacterCostume}`)
  async update(
    @Param(Params.idCharacterCostume) idCharacterCostume: number,
    @Body() dto: CharacterCostumeUpdateDto
  ): Promise<CharacterCostumeViewModel> {
    return this.mapProfile.mapPromise(this.characterCostumeService.update(idCharacterCostume, dto));
  }
}
