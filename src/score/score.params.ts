import { OrderByDirection } from 'st-utils';

export interface ScoreApprovalParams {
  idPlatform?: number;
  idGame?: number;
  idMiniGame?: number;
  idMode?: number;
  page: number;
  limit: number;
  orderBy: string;
  orderByDirection: OrderByDirection;
  idStage?: number;
}
