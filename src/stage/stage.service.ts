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

  async findAll(): Promise<Stage[]> {
    return this.stageRepository.find();
  }

  async add(dto: StageAddDto): Promise<Stage> {
    return this.stageRepository.save(new Stage().extendDto(dto));
  }

  async update(idStage: number, dto: StageUpdateDto): Promise<Stage> {
    await this.stageRepository.update(idStage, dto);
    return this.stageRepository.findOneOrFail(idStage);
  }
}
