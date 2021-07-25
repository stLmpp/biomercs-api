import { Module } from '@nestjs/common';
import { UrlMetadataService } from './url-metadata.service';
import { UrlMetadataController } from './url-metadata.controller';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [EnvironmentModule],
  providers: [UrlMetadataService],
  controllers: [UrlMetadataController],
})
export class UrlMetadataModule {}
