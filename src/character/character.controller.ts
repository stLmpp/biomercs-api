import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CharacterService } from './character.service';
import { Character } from './character.entity';
import { CharacterAddDto, CharacterPlatformsGamesMiniGamesModesDto, CharacterUpdateDto } from './character.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { CharacterViewModel, CharacterViewModelWithCharacterCostumes } from './character.view-model';
import { MapProfile } from '../mapper/map-profile';

@ApiAuth()
@ApiTags('Character')
@Controller('character')
export class CharacterController {
  constructor(
    private characterService: CharacterService,
    @InjectMapProfile(Character, CharacterViewModel) private mapProfile: MapProfile<Character, CharacterViewModel>,
    @InjectMapProfile(Character, CharacterViewModelWithCharacterCostumes)
    private mapProfileWithCharacterCostumes: MapProfile<Character, CharacterViewModelWithCharacterCostumes>
  ) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: CharacterAddDto): Promise<CharacterViewModel> {
    return this.mapProfile.map(await this.characterService.add(dto));
  }

  @ApiAdmin()
  @Patch(`:${Params.idCharacter}`)
  async update(
    @Param(Params.idCharacter) idCharacter: number,
    @Body() dto: CharacterUpdateDto
  ): Promise<CharacterViewModel> {
    return this.mapProfile.map(await this.characterService.update(idCharacter, dto));
  }

  @Get(`platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}`)
  async findByIdPlatformGameMiniGameMode(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number
  ): Promise<CharacterViewModelWithCharacterCostumes[]> {
    return this.mapProfileWithCharacterCostumes.map(
      await this.characterService.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode)
    );
  }

  @Get(`platforms/games/mini-games/modes`)
  async findByIdPlatformsGamesMiniGamesModes(
    @Query() dto: CharacterPlatformsGamesMiniGamesModesDto
  ): Promise<CharacterViewModelWithCharacterCostumes[]> {
    return this.mapProfileWithCharacterCostumes.map(
      await this.characterService.findByIdPlatformsGamesMiniGamesModes(dto)
    );
  }

  @Get(`:${Params.idCharacter}`)
  async findById(@Param(Params.idCharacter) idCharacter: number): Promise<CharacterViewModel> {
    return this.mapProfile.map(await this.characterService.findById(idCharacter));
  }
}
