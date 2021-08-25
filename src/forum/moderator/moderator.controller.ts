import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ModeratorService } from './moderator.service';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { Moderator } from './moderator.entity';
import { ModeratorViewModel, ModeratorViewModelWithInfo } from './moderator.view-model';
import { MapProfile } from '../../mapper/map-profile';
import { ApiAdmin } from '../../auth/api-admin.decorator';

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
  @ApiBody({ type: Number, isArray: true })
  @Post('many')
  async addMany(@Body() idPlayers: number[]): Promise<ModeratorViewModel[]> {
    return this.mapProfile.map(await this.moderatorService.addMany(idPlayers));
  }

  @ApiAdmin()
  @ApiBody({ type: Number, isArray: true })
  @Delete('many')
  async deleteMany(@Body() idPlayers: number[]): Promise<void> {
    await this.moderatorService.deleteMany(idPlayers);
  }
}
