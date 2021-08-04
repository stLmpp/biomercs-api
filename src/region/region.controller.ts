import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { RegionService } from './region.service';
import { RegionViewModel } from './region.view-model';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { Region } from './region.entity';
import { MapProfile } from '../mapper/map-profile';
import { Params } from '../shared/type/params';
import { resolve } from 'path';
import { Response } from 'express';
import { RateLimit } from 'nestjs-rate-limiter';

@ApiTags('Region')
@Controller('region')
export class RegionController {
  constructor(
    private regionService: RegionService,
    @InjectMapProfile(Region, RegionViewModel) private mapProfile: MapProfile<Region, RegionViewModel>
  ) {}

  @ApiAuth()
  @Get()
  async findAll(): Promise<RegionViewModel[]> {
    return this.mapProfile.mapPromise(this.regionService.findAll());
  }

  @RateLimit({
    keyPrefix: 'region/flag/svg',
    points: 300,
    duration: 1,
  })
  @Get(`flag/svg/:${Params.flag}`)
  async getFlagSvg(@Param(Params.flag) flag: string, @Res() response: Response): Promise<any> {
    response
      .type('image/svg+xml')
      .download(resolve(process.cwd() + `/node_modules/flag-icon-css/flags/4x3/${flag}.svg`), `${flag}.svg`);
  }
}
