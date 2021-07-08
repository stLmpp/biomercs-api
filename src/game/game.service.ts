import { Injectable } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { Game } from './game.entity';
import { GameAddDto, GamePlatformsDto, GameUpdateDto } from './game.dto';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';

@Injectable()
export class GameService {
  constructor(private gameRepository: GameRepository) {}

  async findById(idGame: number): Promise<Game> {
    return this.gameRepository.findOneOrFail(idGame);
  }

  async add(dto: GameAddDto): Promise<Game> {
    return this.gameRepository.save(new Game().extendDto(dto));
  }

  async update(idGame: number, dto: GameUpdateDto): Promise<Game> {
    await this.gameRepository.update(idGame, dto);
    return this.gameRepository.findOneOrFail(idGame);
  }

  async findByIdPlatform(idPlatform: number): Promise<Game[]> {
    return this.gameRepository.findByIdPlatform(idPlatform);
  }

  async findByIdPlatforms(dto: GamePlatformsDto): Promise<Game[]> {
    return this.gameRepository.findByIdPlatforms(dto);
  }

  async findApprovalByIdPlatform(
    idScoreStatus: ScoreStatusEnum,
    idPlatform: number,
    idPlayer?: number
  ): Promise<Game[]> {
    return await this.gameRepository.findApprovalByIdPlatform(idScoreStatus, idPlatform, idPlayer);
  }
}
