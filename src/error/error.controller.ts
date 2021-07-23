import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ErrorService } from './error.service';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { ErrorEntity } from './error.entity';
import { ErrorViewModel } from './error.view-model';
import { MapProfile } from '../mapper/map-profile';
import { ApiAuth } from '../auth/api-auth.decorator';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiPagination } from '../shared/decorator/api-pagination';
import { Params } from '../shared/type/params';

@ApiAuth()
@ApiTags('Error')
@Controller('error')
export class ErrorController {
  constructor(
    private errorService: ErrorService,
    @InjectMapProfile(ErrorEntity, ErrorViewModel) private mapProfile: MapProfile<ErrorEntity, ErrorViewModel>
  ) {}

  @ApiAdmin()
  @ApiPagination(ErrorViewModel)
  @Get('paginate')
  async paginate(
    @Query(Params.page) page: number,
    @Query(Params.limit) limit: number
  ): Promise<Pagination<ErrorViewModel>> {
    const { items, meta } = await this.errorService.paginate(page, limit);
    return new Pagination(this.mapProfile.map(items), meta);
  }
}
