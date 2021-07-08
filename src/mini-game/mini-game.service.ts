import { Injectable } from '@nestjs/common';
import { MiniGameRepository } from './mini-game.repository';
import { MiniGame } from './mini-game.entity';
import { MiniGameAddDto, MiniGamePlatformsGamesDto, MiniGameUpdateDto } from './mini-game.dto';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { MiniGameViewModel } from './mini-game.view-model';
import { MapperService } from '../mapper/mapper.service';

@Injectable()
export class MiniGameService {
  constructor(private miniGameRepository: MiniGameRepository, private mapperService: MapperService) {}

  async findById(idMiniGame: number): Promise<MiniGameViewModel> {
    const miniGame = await this.miniGameRepository.findOneOrFail(idMiniGame);
    return this.mapperService.map(MiniGame, MiniGameViewModel, miniGame);
  }

  async add(dto: MiniGameAddDto): Promise<MiniGameViewModel> {
    const miniGame = await this.miniGameRepository.save(new MiniGame().extendDto(dto));
    return this.mapperService.map(MiniGame, MiniGameViewModel, miniGame);
  }

  async update(idMiniGame: number, dto: MiniGameUpdateDto): Promise<MiniGameViewModel> {
    await this.miniGameRepository.update(idMiniGame, dto);
    const miniGame = await this.miniGameRepository.findOneOrFail(idMiniGame);
    return this.mapperService.map(MiniGame, MiniGameViewModel, miniGame);
  }

  async findByIdPlatformGame(idPlatform: number, idGame: number): Promise<MiniGameViewModel[]> {
    const miniGames = await this.miniGameRepository.findByIdPlatformGame(idPlatform, idGame);
    return this.mapperService.map(MiniGame, MiniGameViewModel, miniGames);
  }

  async findByIdPlatformsGames(dto: MiniGamePlatformsGamesDto): Promise<MiniGameViewModel[]> {
    const miniGames = await this.miniGameRepository.findByIdPlatformsGames(dto);
    return this.mapperService.map(MiniGame, MiniGameViewModel, miniGames);
  }

  async findApprovalByIdPlatformGame(
    idScoreStatus: ScoreStatusEnum,
    idPlatform: number,
    idGame: number,
    idPlayer?: number
  ): Promise<MiniGameViewModel[]> {
    const miniGames = await this.miniGameRepository.findApprovalByIdPlatformGame(
      idScoreStatus,
      idPlatform,
      idGame,
      idPlayer
    );
    return this.mapperService.map(MiniGame, MiniGameViewModel, miniGames);
  }
}
