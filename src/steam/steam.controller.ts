import { BadRequestException, Controller, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SteamService } from './steam.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SteamProfile } from './steam-profile.entity';
import { ApiAuth } from '../auth/api-auth.decorator';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.entity';
import { RouteParamEnum } from '../shared/type/route-param.enum';
import { OptionalQueryPipe } from '../shared/pipe/optional-query.pipe';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { environment } from '../environment/environment';

@ApiTags('Steam')
@Controller('steam')
export class SteamController {
  constructor(private steamService: SteamService) {}

  @Get('auth')
  @ApiQuery({ name: RouteParamEnum.idUser, required: false })
  @ApiQuery({ name: RouteParamEnum.idPlayer, required: false })
  async auth(
    @Req() req: Request,
    @Res() res: Response,
    @Query(RouteParamEnum.openidReturnTo) returnUrl: string,
    @Query(RouteParamEnum.idUser, OptionalQueryPipe) idUser?: number,
    @Query(RouteParamEnum.idPlayer, OptionalQueryPipe) idPlayer?: number
  ): Promise<void> {
    if (idUser) {
      await this.steamService.authenticateAndLinkUser(req, idUser, returnUrl);
    } else if (idPlayer) {
      await this.steamService.authenticateAndLinkPlayer(req, idPlayer, returnUrl);
    } else {
      throw new BadRequestException('Needs an idUser or idPlayer to authenticate');
    }
    res.redirect(environment.frontEndUrl);
  }

  @ApiAuth()
  @Put(`:${RouteParamEnum.idSteamProfile}/refresh`)
  async refresh(
    @Param(RouteParamEnum.idSteamProfile) idSteamProfile: number,
    @AuthUser() { id }: User
  ): Promise<SteamProfile> {
    return this.steamService.updateSteamProfile(idSteamProfile, id);
  }

  @ApiAdmin()
  @ApiAuth()
  @Post(`create/:${RouteParamEnum.steamid}`)
  async create(@Param(RouteParamEnum.steamid) steamid: string, @AuthUser() { id }: User): Promise<SteamProfile> {
    return this.steamService.create(steamid, id);
  }
}
