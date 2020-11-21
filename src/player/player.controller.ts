import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { RouteParamEnum } from '../shared/type/route-param.enum';
import { PlayerService } from './player.service';
import { Player } from './player.entity';

@ApiAuth()
@ApiTags('Player')
@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Put(`:${RouteParamEnum.idPlayer}/link-steam`)
  async linkSteamProfile(@Param(RouteParamEnum.idPlayer) idPlayer: number): Promise<string> {
    return this.playerService.linkSteamProfile(idPlayer);
  }

  @Put(`:${RouteParamEnum.idPlayer}/unlink-steam`)
  async unlinkSteamProfile(@Param(RouteParamEnum.idPlayer) idPlayer: number): Promise<Player> {
    return this.playerService.unlinkSteamProfile(idPlayer);
  }

  @Get(`:${RouteParamEnum.idPlayer}`)
  async findById(@Param(RouteParamEnum.idPlayer) idPlayer: number): Promise<Player> {
    return this.playerService.findById(idPlayer);
  }
}
