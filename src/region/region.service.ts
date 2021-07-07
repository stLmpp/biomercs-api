import { Injectable } from '@nestjs/common';
import { RegionRepository } from './region.repository';
import { Region } from './region.entity';
import { ILike } from 'typeorm';
import { RegionViewModel } from './region.view-model';
import { MapperService } from '../mapper/mapper.service';

@Injectable()
export class RegionService {
  constructor(private regionRepository: RegionRepository, private mapperService: MapperService) {}

  async findAll(): Promise<RegionViewModel[]> {
    const regions = await this.regionRepository.find();
    return this.mapperService.map(Region, RegionViewModel, regions);
  }

  async findDefaultIdRegion(): Promise<number> {
    return this.regionRepository
      .findOneOrFail({ select: ['id'], where: { shortName: 'UNKNOWN' } })
      .then(region => region.id);
  }

  async findById(idRegion: number): Promise<Region> {
    return this.regionRepository.findOneOrFail(idRegion);
  }

  async findIdByShortName(shortName: string): Promise<number | undefined> {
    return this.regionRepository.findOne({ where: { shortName: ILike(shortName) } }).then(region => region?.id);
  }
}
