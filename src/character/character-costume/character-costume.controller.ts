import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { CharacterCostumeAddDto, CharacterCostumeUpdateDto } from './character-costume.dto';
import { CharacterCostume } from './character-costume.entity';
import { CharacterCostumeService } from './character-costume.service';
import { Params } from '../../shared/type/params';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { CharacterCostumeViewModel } from './character-costume.view-model';
import { MapProfile } from '../../mapper/map-profile';
import { ApiAdmin } from '../../auth/api-admin.decorator';

@ApiAuth()
@ApiTags('Character costume')
@Controller('character-costume')
export class CharacterCostumeController {
  constructor(
    private characterCostumeService: CharacterCostumeService,
    @InjectMapProfile(CharacterCostume, CharacterCostumeViewModel)
    private mapProfile: MapProfile<CharacterCostume, CharacterCostumeViewModel>
  ) {}

  @ApiAdmin()
  @Post()
  async addCostume(
    @Param(Params.idCharacter) idCharacter: number,
    @Body() dto: CharacterCostumeAddDto
  ): Promise<CharacterCostumeViewModel> {
    return this.mapProfile.map(await this.characterCostumeService.add(dto));
  }

  @ApiAdmin()
  @Patch(`:${Params.idCharacterCostume}`)
  async update(
    @Param(Params.idCharacterCostume) idCharacterCostume: number,
    @Body() dto: CharacterCostumeUpdateDto
  ): Promise<CharacterCostumeViewModel> {
    return this.mapProfile.map(await this.characterCostumeService.update(idCharacterCostume, dto));
  }
}
