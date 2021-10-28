import { Injectable } from '@nestjs/common';
import { PlatformInputTypeRepository } from './platform-input-type.repository';

@Injectable()
export class PlatformInputTypeService {
  constructor(private platformInputTypeRepository: PlatformInputTypeRepository) {}

  async findIdByPlatformInputType(idPlatform: number, idInputType: number): Promise<number> {
    return this.platformInputTypeRepository
      .findOneOrFail({ where: { idPlatform, idInputType }, select: ['id'] })
      .then(platformInputType => platformInputType.id);
  }

  async findIdByPlatformPlayer(idPlatform: number, idPlayer: number): Promise<number | undefined> {
    return this.platformInputTypeRepository.findIdByPlatformPlayer(idPlatform, idPlayer);
  }
}
