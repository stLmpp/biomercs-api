import { Module } from '@nestjs/common';
import { mapperService, MapperService } from './mapper.service';
import { mapProfileProviders, mapProfileTokens } from './map-profiles';

@Module({
  providers: [
    {
      provide: MapperService,
      useValue: mapperService,
    },
    ...mapProfileProviders,
  ],
  exports: [MapperService, ...mapProfileTokens],
})
export class MapperModule {}
