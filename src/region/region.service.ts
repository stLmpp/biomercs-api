import { Injectable } from '@nestjs/common';
import { RegionRepository } from './region.repository';
import { Region } from './region.entity';
import { ILike } from 'typeorm';

@Injectable()
export class RegionService {
  constructor(private regionRepository: RegionRepository) {}

  async findAll(): Promise<Region[]> {
    return this.regionRepository.find();
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
