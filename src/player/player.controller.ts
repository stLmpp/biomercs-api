import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { Player } from './player.entity';
import { MapProfile } from '../mapper/map-profile';

@ApiAuth()
@ApiTags('Player')
@Controller('player')
export class PlayerController {
  constructor(
    private playerService: PlayerService,
    @InjectMapProfile(Player, PlayerViewModel) private mapProfile: MapProfile<Player, PlayerViewModel>,
    @InjectMapProfile(Player, PlayerWithRegionSteamProfileViewModel)
    private mapProfileWithRegionSteamProfile: MapProfile<Player, PlayerWithRegionSteamProfileViewModel>
  ) {}

  @ApiAdmin()
  @Post()
  async create(@Body() dto: PlayerAddDto): Promise<PlayerViewModel> {
    return this.mapProfile.mapPromise(this.playerService.add({ ...dto, noUser: true }));
  }

  @Put(`:${Params.idPlayer}/link-steam`)
  async linkSteamProfile(@Param(Params.idPlayer) idPlayer: number): Promise<string> {
    return this.playerService.linkSteamProfile(idPlayer);
  }

  @Put(`:${Params.idPlayer}/unlink-steam`)
  async unlinkSteamProfile(@Param(Params.idPlayer) idPlayer: number): Promise<PlayerViewModel> {
    return this.mapProfile.mapPromise(this.playerService.unlinkSteamProfile(idPlayer));
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
    return this.mapProfile.mapPromise(this.playerService.findByIdUserOrFail(user.id));
  }

  @ApiQuery({ name: Params.idPlayersSelected, required: false })
  @ApiPagination(PlayerViewModel)
  @Get('search-paginated')
  async findBySearchPaginated(
    @Query(Params.personaName) personaName: string,
    @AuthUser() user: User,
    @Query(Params.page) page: number,
    @Query(Params.limit) limit: number,
    @Query(Params.idPlayersSelected, new ParseArrayPipe({ items: Number, optional: true })) idPlayersSelected?: number[]
  ): Promise<Pagination<PlayerViewModel>> {
    if (!personaName || personaName.length < 3) {
      return { items: [], meta: { itemsPerPage: 0, currentPage: 0, totalItems: 0, totalPages: 0, itemCount: 0 } };
    }
    const { items, meta } = await this.playerService.findBySearchPaginated({
      page,
      limit,
      personaName,
      isAdmin: user.admin,
      idUser: user.id,
      idPlayersSelected: idPlayersSelected ?? [],
    });
    const players = this.mapProfile.map(items);
    return new Pagination(players, meta);
  }

  @ApiQuery({ name: Params.idPlayersSelected, required: false, isArray: true, type: Number })
  @Get('search')
  async findBySearch(
    @AuthUser() user: User,
    @Query(Params.personaName) personaName: string,
    @Query(Params.idPlayersSelected, new ParseArrayPipe({ items: Number, optional: true })) idPlayersSelected?: number[]
  ): Promise<PlayerViewModel[]> {
    if (!personaName || personaName.length < 3) {
      return [];
    }
    return this.mapProfile.map(
      await this.playerService.findBySearch({
        personaName,
        idPlayersSelected: idPlayersSelected ?? [],
        isAdmin: user.admin,
        idUser: user.id,
      })
    );
  }

  @Get('exists')
  async personaNameExists(@Query(Params.personaName) personaName: string): Promise<boolean> {
    return this.playerService.personaNameExists(personaName);
  }

  @Get(`:${Params.idPlayer}`)
  async findById(@Param(Params.idPlayer) idPlayer: number): Promise<PlayerWithRegionSteamProfileViewModel> {
    return this.mapProfileWithRegionSteamProfile.mapPromise(this.playerService.findById(idPlayer));
  }

  @Patch(`:${Params.idPlayer}`)
  async update(
    @Param(Params.idPlayer) idPlayer: number,
    @Body() dto: PlayerUpdateDto
  ): Promise<PlayerWithRegionSteamProfileViewModel> {
    return this.mapProfileWithRegionSteamProfile.mapPromise(this.playerService.update(idPlayer, dto));
  }

  @ApiBody({
    required: true,
    schema: { type: 'object', properties: { personaName: { type: 'string' } } },
  })
  @ApiResponse({ status: 200, type: 'string', description: 'Returns the updated lastUpdatedPersonaNameDate' })
  @Put(`:${Params.idPlayer}/personaName`)
  async updatePersonaName(
    @Param(Params.idPlayer) idPlayer: number,
    @Body(Params.personaName) personaName: string
  ): Promise<string> {
    if (!personaName) {
      throw new BadRequestException('personaName is required');
    }
    if (personaName.length < 3) {
      throw new BadRequestException('personaName must have at least 3 characters');
    }
    return this.playerService.updatePersonaName(idPlayer, personaName);
  }
}
