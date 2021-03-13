import { Controller, Get, Query } from '@nestjs/common';
import { UrlMetadataViewModel } from './url-metadata.view-model';
import { Params } from '../shared/type/params';
import { UrlMetadataService } from './url-metadata.service';
import { ApiAuth } from '../auth/api-auth.decorator';

@ApiAuth()
@Controller('url-metadata')
export class UrlMetadataController {
  constructor(private urlMetadataService: UrlMetadataService) {}

  @Get()
  async getMetadata(@Query(Params.url) url: string): Promise<UrlMetadataViewModel> {
    return this.urlMetadataService.getMetadata(url);
  }
}
