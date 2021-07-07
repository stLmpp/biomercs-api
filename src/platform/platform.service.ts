import { Injectable } from '@nestjs/common';
import { PlatformRepository } from './platform.repository';
import { Platform } from './platform.entity';
import { PlatformAddDto, PlatformUpdateDto } from './platform.dto';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { MapperService } from '../mapper/mapper.service';
import { PlatformViewModel } from './platform.view-model';

@Injectable()
export class PlatformService {
  constructor(private platformRepository: PlatformRepository, private mapperService: MapperService) {}

  async findById(idPlatform: number): Promise<PlatformViewModel> {
    const platform = await this.platformRepository.findOneOrFail(idPlatform);
    return this.mapperService.map(Platform, PlatformViewModel, platform);
  }

  async findAll(): Promise<PlatformViewModel[]> {
    const platforms = await this.platformRepository.find({ order: { id: 'ASC' } });
    return this.mapperService.map(Platform, PlatformViewModel, platforms);
  }

  async add(dto: PlatformAddDto): Promise<PlatformViewModel> {
    const platform = await this.platformRepository.save(new Platform().extendDto(dto));
    return this.mapperService.map(Platform, PlatformViewModel, platform);
  }

  async update(idPlatform: number, dto: PlatformUpdateDto): Promise<PlatformViewModel> {
    await this.platformRepository.update(idPlatform, dto);
    const platform = await this.platformRepository.findOneOrFail(idPlatform);
    return this.mapperService.map(Platform, PlatformViewModel, platform);
  }

  async findApproval(idScoreStatus: ScoreStatusEnum, idPlayer?: number): Promise<PlatformViewModel[]> {
    const platforms = await this.platformRepository.findApproval(idScoreStatus, idPlayer);
    return this.mapperService.map(Platform, PlatformViewModel, platforms);
  }
}
