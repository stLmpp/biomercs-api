import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CharacterService } from './character.service';
import { Character } from './character.entity';
import { CharacterAddDto, CharacterUpdateDto } from './character.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';

@ApiAuth()
@ApiTags('Character')
@Controller('character')
export class CharacterController {
  constructor(private characterService: CharacterService) {}

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

  @Get()
  async findAll(): Promise<Character[]> {
    return this.characterService.findAll();
  }

  @Get(`:${Params.idCharacter}`)
  async findById(@Param(Params.idCharacter) idCharacter: number): Promise<Character> {
    return this.characterService.findById(idCharacter);
  }
}
