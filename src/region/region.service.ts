import { Injectable } from '@nestjs/common';
import { RegionRepository } from './region.repository';
import { Region } from './region.entity';

@Injectable()
export class RegionService {
  constructor(private regionRepository: RegionRepository) {
    this._setDefaultRegions().then();
  }

  private async _setDefaultRegions(): Promise<void> {
    const exists = await this.regionRepository.exists();
    if (!exists) {
      const regionsJson = await import('./regions.json');
      await this.regionRepository.save(regionsJson);
    }
  }

  async findAll(): Promise<Region[]> {
    return this.regionRepository.find();
  }

  async findDefaultIdRegion(): Promise<number> {
    return (await this.regionRepository.findOneOrFail({ select: ['id'], where: { shortName: 'UNKNOWN' } })).id;
  }

  async findById(idRegion: number): Promise<Region> {
    return this.regionRepository.findOneOrFail(idRegion);
  }
}
