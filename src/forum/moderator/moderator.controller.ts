import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ModeratorService } from './moderator.service';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { Moderator } from './moderator.entity';
import { ModeratorViewModel, ModeratorViewModelWithInfo } from './moderator.view-model';
import { MapProfile } from '../../mapper/map-profile';
import { ApiAdmin } from '../../auth/api-admin.decorator';
import { ModeratorAddAndDeleteDto } from './moderator.dto';

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

  @ApiAdmin()
  @Put('add-and-delete')
  async addAndDelete(@Body() dto: ModeratorAddAndDeleteDto): Promise<ModeratorViewModelWithInfo[]> {
    return this.mapProfileWithInfo.map(await this.moderatorService.addAndDelete(dto));
  }
}
