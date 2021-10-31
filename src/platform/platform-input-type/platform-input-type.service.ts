import { Injectable } from '@nestjs/common';
import { PlatformInputTypeRepository } from './platform-input-type.repository';
import { PlatformInputType } from './platform-input-type.entity';

@Injectable()
export class PlatformInputTypeService {
  constructor(private platformInputTypeRepository: PlatformInputTypeRepository) {}

  async findIdByPlatformInputType(idPlatform: number, idInputType: number): Promise<number> {
    return this.platformInputTypeRepository
      .findOneOrFail({ where: { idPlatform, idInputType }, select: ['id'] })
      .then(platformInputType => platformInputType.id);
  }

  async findByPlatform(idPlatform: number): Promise<PlatformInputType[]> {
    return this.platformInputTypeRepository.find({ where: { idPlatform }, relations: ['inputType'] });
  }

  async findIdByPlatformPlayer(idPlatform: number, idPlayer: number): Promise<number | undefined> {
    return this.platformInputTypeRepository.findIdByPlatformPlayer(idPlatform, idPlayer);
  }
}
