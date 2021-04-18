import { Injectable } from '@nestjs/common';
import { PlatformGameMiniGameModeStageRepository } from './platform-game-mini-game-mode-stage.repository';
import { PlatformGameMiniGameModeService } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.service';
import { PlatformGameMiniGameModeStage } from './platform-game-mini-game-mode-stage.entity';

@Injectable()
export class PlatformGameMiniGameModeStageService {
  constructor(
    private platformGameMiniGameModeStageRepository: PlatformGameMiniGameModeStageRepository,
    private platformGameMiniGameModeService: PlatformGameMiniGameModeService
  ) {}

  async link(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idStage: number
  ): Promise<PlatformGameMiniGameModeStage> {
    const idPlatformGameMiniGameMode = await this.platformGameMiniGameModeService.findIdByPlaformGameMiniGameMode(
      idPlatform,
      idGame,
      idMiniGame,
      idMode
    );
    return this.platformGameMiniGameModeStageRepository.save(
      new PlatformGameMiniGameModeStage().extendDto({ idPlatformGameMiniGameMode, idStage })
    );
  }

  async unlink(idPlatform: number, idGame: number, idMiniGame: number, idMode: number, idStage: number): Promise<void> {
    const idPlatformGameMiniGameModeStage = await this.findIdByPlatformGameMiniGameModeStage(
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      idStage
    );
    await this.platformGameMiniGameModeStageRepository.delete(idPlatformGameMiniGameModeStage);
  }

  async findIdByPlatformGameMiniGameModeStage(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idStage: number
  ): Promise<number> {
    return this.platformGameMiniGameModeStageRepository.findIdByPlatformGameMiniGameModeStage(
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      idStage
    );
  }

  async findByPlatformGameMiniGameModeStage(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    idStage: number
  ): Promise<PlatformGameMiniGameModeStage> {
    return this.platformGameMiniGameModeStageRepository.findByPlatformGameMiniGameModeStage(
      idPlatform,
      idGame,
      idMiniGame,
      idMode,
      idStage
    );
  }

  async findByPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Promise<PlatformGameMiniGameModeStage[]> {
    return this.platformGameMiniGameModeStageRepository.findByPlatformGameMiniGameMode(
      idPlatform,
      idGame,
      idMiniGame,
      idMode
    );
  }

  async findRandom({
    game,
    miniGame,
    mode,
    platform,
    stage,
  }: {
    platform?: string;
    game?: string;
    miniGame?: string;
    mode?: string;
    stage?: string;
  } = {}): Promise<PlatformGameMiniGameModeStage> {
    const qb = this.platformGameMiniGameModeStageRepository
      .createQueryBuilder('pgmms')
      .innerJoinAndSelect('pgmms.platformGameMiniGameMode', 'pgmm')
      .innerJoinAndSelect('pgmms.stage', 's')
      .innerJoinAndSelect('pgmm.mode', 'm')
      .innerJoinAndSelect('pgmm.platformGameMiniGame', 'pgm')
      .innerJoinAndSelect('pgm.gameMiniGame', 'gm')
      .innerJoin('gm.game', 'g')
      .innerJoin('gm.miniGame', 'mg')
      .innerJoin('pgm.platform', 'p')
      .orderBy('random()');
    if (game) {
      qb.andWhere('g.shortName = :game', { game });
    }
    if (miniGame) {
      qb.andWhere('mg.name = :miniGame', { miniGame });
    }
    if (mode) {
      qb.andWhere('m.name = :mode', { mode });
    }
    if (platform) {
      qb.andWhere('p.shortName = :platform', { platform });
    }
    if (stage) {
      qb.andWhere('s.shortName = :stage', { stage });
    }
    return qb.getOneOrFail();
  }
}
