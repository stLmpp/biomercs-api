import { Injectable } from '@nestjs/common';
import { GameRepository } from './game.repository';
import { Game } from './game.entity';
import { GameAddDto, GamePlatformsDto, GameUpdateDto } from './game.dto';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { GameViewModel } from './game.view-model';
import { MapperService } from '../mapper/mapper.service';

@Injectable()
export class GameService {
  constructor(private gameRepository: GameRepository, private mapperService: MapperService) {}

  async findById(idGame: number): Promise<GameViewModel> {
    const game = await this.gameRepository.findOneOrFail(idGame);
    return this.mapperService.map(Game, GameViewModel, game);
  }

  async add(dto: GameAddDto): Promise<GameViewModel> {
    const game = await this.gameRepository.save(new Game().extendDto(dto));
    return this.mapperService.map(Game, GameViewModel, game);
  }

  async update(idGame: number, dto: GameUpdateDto): Promise<GameViewModel> {
    await this.gameRepository.update(idGame, dto);
    const game = await this.gameRepository.findOneOrFail(idGame);
    return this.mapperService.map(Game, GameViewModel, game);
  }

  async findByIdPlatform(idPlatform: number): Promise<GameViewModel[]> {
    const games = await this.gameRepository.findByIdPlatform(idPlatform);
    return this.mapperService.map(Game, GameViewModel, games);
  }

  async findByIdPlatforms(dto: GamePlatformsDto): Promise<GameViewModel[]> {
    const games = await this.gameRepository.findByIdPlatforms(dto);
    return this.mapperService.map(Game, GameViewModel, games);
  }

  async findApprovalByIdPlatform(
    idScoreStatus: ScoreStatusEnum,
    idPlatform: number,
    idPlayer?: number
  ): Promise<GameViewModel[]> {
    const games = await this.gameRepository.findApprovalByIdPlatform(idScoreStatus, idPlatform, idPlayer);
    return this.mapperService.map(Game, GameViewModel, games);
  }
}
