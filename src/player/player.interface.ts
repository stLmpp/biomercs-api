export interface PlayerInterface {
  id: number;
  personaName: string;
  title?: string;
  aboutMe?: string;
  idUser?: number;
  idSteamProfile?: number;
  noUser: boolean;
  idRegion: number;
  avatar?: string | null;
}
