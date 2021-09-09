import { Body, Controller, Get, ParseArrayPipe, Put, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ModeratorService } from './moderator.service';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { Moderator } from './moderator.entity';
import { ModeratorViewModel, ModeratorViewModelWithInfo } from './moderator.view-model';
import { MapProfile } from '../../mapper/map-profile';
import { ApiAdmin } from '../../auth/api-admin.decorator';
import { ModeratorAddAndDeleteDto } from './moderator.dto';
import { Params } from '../../shared/type/params';

@ApiAuth()
@ApiTags('Moderator')
@Controller()
export class ModeratorController {
  constructor(
    private moderatorService: ModeratorService,
    @InjectMapProfile(Moderator, ModeratorViewModelWithInfo)
    private mapProfileWithInfo: MapProfile<Moderator, ModeratorViewModelWithInfo>,
    @InjectMapProfile(Moderator, ModeratorViewModel)
    private mapProfile: MapProfile<Moderator, ModeratorViewModel>
  ) {}

  @ApiAdmin()
  @Get()
  async findAll(): Promise<ModeratorViewModelWithInfo[]> {
    return this.mapProfileWithInfo.map(await this.moderatorService.findAll());
  }

  @ApiQuery({ name: Params.idModeratorsSelected, required: false, isArray: true, type: Number })
  @ApiAdmin()
  @Get('search')
  async search(
    @Query(Params.term) term: string,
    @Query(Params.idModeratorsSelected, new ParseArrayPipe({ items: Number, optional: true }))
    idModeratorsSelected?: number[]
  ): Promise<ModeratorViewModel[]> {
    return this.mapProfile.map(await this.moderatorService.search(term, idModeratorsSelected ?? []));
  }

  @ApiAdmin()
  @Put('add-and-delete')
  async addAndDelete(@Body() dto: ModeratorAddAndDeleteDto): Promise<ModeratorViewModelWithInfo[]> {
    return this.mapProfileWithInfo.map(await this.moderatorService.addAndDelete(dto));
  }
}
