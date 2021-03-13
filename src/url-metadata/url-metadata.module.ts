import { Module } from '@nestjs/common';
import { UrlMetadataService } from './url-metadata.service';
import { UrlMetadataController } from './url-metadata.controller';

@Module({
  providers: [UrlMetadataService],
  controllers: [UrlMetadataController],
})
export class UrlMetadataModule {}
