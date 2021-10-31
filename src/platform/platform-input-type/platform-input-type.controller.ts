import { Controller, Get, Param } from '@nestjs/common';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { PlatformInputTypeService } from './platform-input-type.service';
import { PlatformInputTypeViewModel } from './platform-input-type.view-model';
import { Params } from '../../shared/type/params';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { PlatformInputType } from './platform-input-type.entity';
import { MapProfile } from '../../mapper/map-profile';

@ApiAuth()
@ApiTags('Platform input type')
@Controller('platform-input-type')
export class PlatformInputTypeController {
  constructor(
    private platformInputTypeService: PlatformInputTypeService,
    @InjectMapProfile(PlatformInputType, PlatformInputTypeViewModel)
    private mapProfile: MapProfile<PlatformInputType, PlatformInputTypeViewModel>
  ) {}

  @Get(`platform/:${Params.idPlatform}`)
  async findByPlatform(@Param(Params.idPlatform) idPlatform: number): Promise<PlatformInputTypeViewModel[]> {
    return this.mapProfile.map(await this.platformInputTypeService.findByPlatform(idPlatform));
  }
}
