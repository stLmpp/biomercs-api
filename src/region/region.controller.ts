import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { RegionService } from './region.service';
import { RegionViewModel } from './region.view-model';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { Region } from './region.entity';
import { MapProfile } from '../mapper/map-profile';

@ApiAuth()
@ApiTags('Region')
@Controller('region')
export class RegionController {
  constructor(
    private regionService: RegionService,
    @InjectMapProfile(Region, RegionViewModel) private mapProfile: MapProfile<Region, RegionViewModel>
  ) {}

  @Get()
  async findAll(): Promise<RegionViewModel[]> {
    return this.mapProfile.mapPromise(this.regionService.findAll());
  }
}
