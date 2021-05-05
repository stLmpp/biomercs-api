import { Injectable } from '@nestjs/common';
import { StageRepository } from './stage.repository';
import { Stage } from './stage.entity';
import { StageAddDto, StagePlatformsGamesMiniGamesModesDto, StageUpdateDto } from './stage.dto';
import { StageViewModel } from './stage.view-model';
import { MapperService } from '../mapper/mapper.service';

@Injectable()
export class StageService {
  constructor(private stageRepository: StageRepository, private mapperService: MapperService) {}

  async findById(idStage: number): Promise<StageViewModel> {
    const stage = await this.stageRepository.findOneOrFail(idStage);
    return this.mapperService.map(Stage, StageViewModel, stage);
  }

  async add(dto: StageAddDto): Promise<StageViewModel> {
    const stage = await this.stageRepository.save(new Stage().extendDto(dto));
    return this.mapperService.map(Stage, StageViewModel, stage);
  }

  async update(idStage: number, dto: StageUpdateDto): Promise<StageViewModel> {
    await this.stageRepository.update(idStage, dto);
    const stage = await this.stageRepository.findOneOrFail(idStage);
    return this.mapperService.map(Stage, StageViewModel, stage);
  }

  async findByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<StageViewModel[]> {
    const stages = await this.stageRepository.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode);
    return this.mapperService.map(Stage, StageViewModel, stages);
  }

  async findByIdPlatformsGamesMiniGamesModes(dto: StagePlatformsGamesMiniGamesModesDto): Promise<StageViewModel[]> {
    const stages = await this.stageRepository.findByIdPlatformsGamesMiniGamesModes(dto);
    return this.mapperService.map(Stage, StageViewModel, stages);
  }
}
