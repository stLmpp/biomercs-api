import { Injectable } from '@nestjs/common';
import { MiniGameRepository } from './mini-game.repository';
import { MiniGame } from './mini-game.entity';
import { MiniGameAddDto, MiniGamePlatformsGamesDto, MiniGameUpdateDto } from './mini-game.dto';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';

@Injectable()
export class MiniGameService {
  constructor(private miniGameRepository: MiniGameRepository) {}

  async findById(idMiniGame: number): Promise<MiniGame> {
    return this.miniGameRepository.findOneOrFail(idMiniGame);
  }

  async add(dto: MiniGameAddDto): Promise<MiniGame> {
    return this.miniGameRepository.save(new MiniGame().extendDto(dto));
  }

  async update(idMiniGame: number, dto: MiniGameUpdateDto): Promise<MiniGame> {
    await this.miniGameRepository.update(idMiniGame, dto);
    return this.miniGameRepository.findOneOrFail(idMiniGame);
  }

  async findByIdPlatformGame(idPlatform: number, idGame: number): Promise<MiniGame[]> {
    return this.miniGameRepository.findByIdPlatformGame(idPlatform, idGame);
  }

  async findByIdPlatformsGames(dto: MiniGamePlatformsGamesDto): Promise<MiniGame[]> {
    return this.miniGameRepository.findByIdPlatformsGames(dto);
  }

  async findApprovalByIdPlatformGame(
    idScoreStatus: ScoreStatusEnum,
    idPlatform: number,
    idGame: number,
    idPlayer?: number
  ): Promise<MiniGame[]> {
    return this.miniGameRepository.findApprovalByIdPlatformGame(idScoreStatus, idPlatform, idGame, idPlayer);
  }
}
