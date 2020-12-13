import { Injectable } from '@nestjs/common';
import { StageRepository } from './stage.repository';
import { Stage } from './stage.entity';
import { StageAddDto, StageUpdateDto } from './stage.dto';

@Injectable()
export class StageService {
  constructor(private stageRepository: StageRepository) {}

  async findById(idStage: number): Promise<Stage> {
    return this.stageRepository.findOneOrFail(idStage);
  }

  async add(dto: StageAddDto): Promise<Stage> {
    return this.stageRepository.save(new Stage().extendDto(dto));
  }

  async update(idStage: number, dto: StageUpdateDto): Promise<Stage> {
    await this.stageRepository.update(idStage, dto);
    return this.stageRepository.findOneOrFail(idStage);
  }

  async findByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<Stage[]> {
    return this.stageRepository.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode);
  }
}
