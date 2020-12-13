import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CharacterService } from './character.service';
import { Character } from './character.entity';
import { CharacterAddDto, CharacterUpdateDto } from './character.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';
import { CharacterCostume } from './character-costume/character-costume.entity';
import { CharacterCostumeAddDto } from './character-costume/character-costume.dto';
import { CharacterCostumeService } from './character-costume/character-costume.service';

@ApiAuth()
@ApiTags('Character')
@Controller('character')
export class CharacterController {
  constructor(private characterService: CharacterService, private characterCostumeService: CharacterCostumeService) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: CharacterAddDto): Promise<Character> {
    return this.characterService.add(dto);
  }

  @ApiAdmin()
  @Patch(`:${Params.idCharacter}`)
  async update(@Param(Params.idCharacter) idCharacter: number, @Body() dto: CharacterUpdateDto): Promise<Character> {
    return this.characterService.update(idCharacter, dto);
  }

  @ApiAdmin()
  @Post(`:${Params.idCharacter}/costume`)
  async addCostume(
    @Param(Params.idCharacter) idCharacter: number,
    @Body() dto: CharacterCostumeAddDto
  ): Promise<CharacterCostume> {
    return this.characterCostumeService.add(idCharacter, dto);
  }

  @Get(`platform/:${Params.idPlatform}/game/:${Params.idGame}/mini-game/:${Params.idMiniGame}/mode/:${Params.idMode}`)
  async findByIdPlatformGameMiniGameMode(
    @Param(Params.idPlatform) idPlatform: number,
    @Param(Params.idGame) idGame: number,
    @Param(Params.idMiniGame) idMiniGame: number,
    @Param(Params.idMode) idMode: number
  ): Promise<Character[]> {
    return this.characterService.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode);
  }

  @Get(`:${Params.idCharacter}`)
  async findById(@Param(Params.idCharacter) idCharacter: number): Promise<Character> {
    return this.characterService.findById(idCharacter);
  }
}
