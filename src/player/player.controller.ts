import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { PlayerService } from './player.service';
import { Params } from '../shared/type/params';
import { PlayerAddDto, PlayerUpdateDto } from './player.dto';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.entity';
import { PlayerViewModel, PlayerWithRegionSteamProfileViewModel } from './player.view-model';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiPagination } from '../shared/decorator/api-pagination';

@ApiAuth()
@ApiTags('Player')
@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @ApiAdmin()
  @Post()
  async create(@Body() dto: PlayerAddDto): Promise<PlayerViewModel> {
    return this.playerService.add({ ...dto, noUser: true });
  }

  @Put(`:${Params.idPlayer}/link-steam`)
  async linkSteamProfile(@Param(Params.idPlayer) idPlayer: number): Promise<string> {
    return this.playerService.linkSteamProfile(idPlayer);
  }

  @Put(`:${Params.idPlayer}/unlink-steam`)
  async unlinkSteamProfile(@Param(Params.idPlayer) idPlayer: number): Promise<PlayerViewModel> {
    return this.playerService.unlinkSteamProfile(idPlayer);
  }

  @Get(`persona-name/:${Params.personaName}/id`)
  async findIdByPersonaName(@Param(Params.personaName) personaName: string): Promise<number> {
    return this.playerService.findIdByPersonaName(personaName);
  }

  @Get(`user/:${Params.idUser}/id`)
  async findIdByIdUser(@Param(Params.idUser) idUser: number): Promise<number> {
    return this.playerService.findIdByIdUser(idUser);
  }

  @Get('auth')
  async findAuthPlayer(@AuthUser() user: User): Promise<PlayerViewModel> {
    return this.playerService.findByIdUserOrThrow(user.id);
  }

  @ApiPagination(PlayerViewModel)
  @Get('search')
  async findBySearch(
    @Query(Params.personaName) personaName: string,
    @AuthUser() user: User,
    @Query(Params.page) page: number,
    @Query(Params.limit) limit: number
  ): Promise<Pagination<PlayerViewModel>> {
    return this.playerService.findBySearch(personaName, user.id, page, limit);
  }

  @Get('exists')
  async personaNameExists(@Query(Params.personaName) personaName: string): Promise<boolean> {
    return this.playerService.personaNameExists(personaName);
  }

  @Get(`:${Params.idPlayer}`)
  async findById(@Param(Params.idPlayer) idPlayer: number): Promise<PlayerWithRegionSteamProfileViewModel> {
    return this.playerService.findByIdMapped(idPlayer);
  }

  @Patch(`:${Params.idPlayer}`)
  async update(
    @Param(Params.idPlayer) idPlayer: number,
    @Body() dto: PlayerUpdateDto
  ): Promise<PlayerWithRegionSteamProfileViewModel> {
    return this.playerService.update(idPlayer, dto);
  }
}
