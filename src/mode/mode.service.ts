import { Injectable } from '@nestjs/common';
import { ModeRepository } from './mode.repository';
import { Mode } from './mode.entity';
import { ModeAddDto, ModePlatformsGamesMiniGamesDto, ModeUpdateDto } from './mode.dto';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';

@Injectable()
export class ModeService {
  constructor(private modeRepository: ModeRepository) {}

  async findById(idMode: number): Promise<Mode> {
    return this.modeRepository.findOneOrFail(idMode);
  }

  async add(dto: ModeAddDto): Promise<Mode> {
    return this.modeRepository.save(new Mode().extendDto(dto));
  }

  async update(idMode: number, dto: ModeUpdateDto): Promise<Mode> {
    await this.modeRepository.update(idMode, dto);
    return this.modeRepository.findOneOrFail(idMode);
  }

  async findByIdPlatformGameMiniGame(idPlatform: number, idGame: number, idMiniGame: number): Promise<Mode[]> {
    return this.modeRepository.findByIdPlatformGameMiniGame(idPlatform, idGame, idMiniGame);
  }

  async findByIdPlatformsGamesMiniGames(dto: ModePlatformsGamesMiniGamesDto): Promise<Mode[]> {
    return this.modeRepository.findByIdPlatformsGamesMiniGames(dto);
  }

  async findByIdPlatformGameMiniGameModeStage(idPlatformGameMiniGameModeStage: number): Promise<Mode | undefined> {
    return this.modeRepository.findByIdPlatformGameMiniGameModeStage(idPlatformGameMiniGameModeStage);
  }

  async findApprovalByIdPlatformGameMiniGame(
    idScoreStatus: ScoreStatusEnum,
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idPlayer?: number
  ): Promise<Mode[]> {
    return this.modeRepository.findApprovalByIdPlatformGameMiniGame(
      idScoreStatus,
      idPlatform,
      idGame,
      idMiniGame,
      idPlayer
    );
  }
}
