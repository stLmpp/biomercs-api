import { Property } from '../../mapper/property.decorator';

export class ScorePlayerViewModel {
  @Property() idScorePlayer!: number;
  @Property() idScore!: number;
  @Property() idPlayer!: number;
  @Property() playerPersonaName!: string;
  @Property() idPlatformGameMiniGameModeCharacterCostume!: number;
  @Property() isCharacterWorldRecord!: boolean;
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
  @Property() approvalDate?: Date;
  @Property() idScoreStatus!: number;
  @Property() scoreStatusDescription!: string;
  @Property(() => ScorePlayerViewModel) scorePlayers!: ScorePlayerViewModel[];
  @Property() creationDate!: Date;
  @Property() lastUpdatedDate!: Date | null;
  @Property() isWorldRecord!: boolean;
  @Property() isCharacterWorldRecord!: boolean;
  @Property() isCombinationWorldRecord!: boolean;
}
