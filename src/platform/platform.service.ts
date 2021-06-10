import { Injectable } from '@nestjs/common';
import { PlatformRepository } from './platform.repository';
import { Platform } from './platform.entity';
import { PlatformAddDto, PlatformUpdateDto } from './platform.dto';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';

@Injectable()
export class PlatformService {
  constructor(private platformRepository: PlatformRepository) {}

  async findById(idPlatform: number): Promise<Platform> {
    return this.platformRepository.findOneOrFail(idPlatform);
  }

  async findAll(): Promise<Platform[]> {
    return this.platformRepository.find({ order: { id: 'ASC' } });
  }

  async add(dto: PlatformAddDto): Promise<Platform> {
    return this.platformRepository.save(new Platform().extendDto(dto));
  }

  async update(idPlatform: number, dto: PlatformUpdateDto): Promise<Platform> {
    await this.platformRepository.update(idPlatform, dto);
    return this.platformRepository.findOneOrFail(idPlatform);
  }

  async findApproval(idScoreStatus: ScoreStatusEnum, idPlayer?: number): Promise<Platform[]> {
    return this.platformRepository.findApproval(idScoreStatus, idPlayer);
  }
}
