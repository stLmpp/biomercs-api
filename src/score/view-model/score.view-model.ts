import { ScoreStatusEnum } from '../score-status.enum';
import { Property } from '../../mapper/mapper.service';

export class ScorePlayerViewModel {
  @Property() idScore!: number;
  @Property() idPlayer!: number;
  @Property() playerPersonaName!: string;
  @Property() idPlatformGameMiniGameModeCharacterCostume!: number;
  @Property() idCharacterCostume!: number;
  @Property() characterCostumeName!: string;
  @Property() characterCostumeShortName!: string;
  @Property() idCharacter!: number;
  @Property() characterName!: string;
  @Property() host!: boolean;
  @Property() bulletKills!: number;
  @Property() description?: string;
  @Property() evidence!: string;
}

export class ScoreViewModel {
  @Property() idPlatformGameMiniGameModeStage!: number;
  @Property() idPlatformGameMiniGameMode!: number;
  @Property() idPlatformGameMiniGame!: number;
  @Property() idGameMiniGame!: number;
  @Property() idPlatform!: number;
  @Property() platformName!: string;
  @Property() platformShortName!: string;
  @Property() idGame!: number;
  @Property() gameName!: string;
  @Property() gameShortName!: string;
  @Property() idMiniGame!: number;
  @Property() miniGameName!: string;
  @Property() idScore!: number;
  @Property() idStage!: number;
  @Property() stageName!: string;
  @Property() stageShortName!: string;
  @Property() idMode!: number;
  @Property() modeName!: string;
  @Property() score!: number;
  @Property() maxCombo!: number;
  @Property() time!: string;
  @Property() dateAchieved?: Date;
  @Property() status!: ScoreStatusEnum;
  @Property() scorePlayers!: ScorePlayerViewModel[];
  @Property() creationDate!: Date;
}
