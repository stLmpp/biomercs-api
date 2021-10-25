import { BadRequestException, Controller, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SteamService } from './steam.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { OptionalQueryPipe } from '../shared/pipe/optional-query.pipe';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { Params } from '../shared/type/params';
import { SteamProfileViewModel, SteamProfileWithPlayerViewModel } from './steam-profile.view-model';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { SteamProfile } from './steam-profile.entity';
import { MapProfile } from '../mapper/map-profile';
import { Environment } from '../environment/environment';

@ApiTags('Steam')
@Controller('steam')
export class SteamController {
  constructor(
    private steamService: SteamService,
    @InjectMapProfile(SteamProfile, SteamProfileWithPlayerViewModel)
    private mapProfileSteamProfileWithPlayer: MapProfile<SteamProfile, SteamProfileWithPlayerViewModel>,
    @InjectMapProfile(SteamProfile, SteamProfileViewModel)
    private mapProfile: MapProfile<SteamProfile, SteamProfileViewModel>,
    private environment: Environment
  ) {}

  @Get('auth')
  @ApiQuery({ name: Params.idUser, required: false })
  @ApiQuery({ name: Params.idPlayer, required: false })
  async auth(
    @Req() req: Request,
    @Res() res: Response,
    @Query(Params.openidReturnTo) returnUrl: string,
    @Query(Params.idUser, OptionalQueryPipe) idUser?: number,
    @Query(Params.idPlayer, OptionalQueryPipe) idPlayer?: number
  ): Promise<void> {
    if (idUser) {
      await this.steamService.authenticateAndLinkUser(req, idUser, returnUrl);
    } else if (idPlayer) {
      await this.steamService.authenticateAndLinkPlayer(req, idPlayer, returnUrl);
    } else {
      throw new BadRequestException('Needs an idUser or idPlayer to authenticate');
    }
    res.redirect(this.environment.frontEndUrl);
  }

  @ApiAuth()
  @Get('exists')
  async steamIdExists(@Query(Params.steamid) steamid: string): Promise<boolean> {
    return this.steamService.steamIdExists(steamid);
  }

  @ApiAuth()
  @Put(`:${Params.idSteamProfile}/refresh`)
  async refresh(@Param(Params.idSteamProfile) idSteamProfile: number): Promise<SteamProfileViewModel> {
    return this.mapProfile.map(await this.steamService.updateSteamProfile(idSteamProfile));
  }

  @ApiAdmin()
  @ApiAuth()
  @Post(`create/:${Params.steamid}`)
  async create(@Param(Params.steamid) steamid: string): Promise<SteamProfileWithPlayerViewModel> {
    return this.mapProfileSteamProfileWithPlayer.map(await this.steamService.createWithPlayer(steamid, true));
  }
}
