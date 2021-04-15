export interface RawSteamProfile {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff?: number;
  personastate: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags: number;
  gameextrainfo?: string;
  gameid?: string;
  loccountrycode?: string;
}

export interface SteamProfileInterface extends RawSteamProfile {
  id: number;
}
