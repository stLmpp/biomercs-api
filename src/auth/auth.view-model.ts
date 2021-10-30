import { Property } from '../mapper/property.decorator';

export class AuthRegisterViewModel {
  @Property() email!: string;
  @Property() message!: string;
  @Property() idUser!: number;
}

export enum AuthSteamLoginSocketErrorType {
  userNotFound,
  userNotConfirmed,
  userLocked,
  userBanned,
  unknown,
}

export class AuthSteamLoginSocketViewModel {
  @Property() uuid!: string;
  @Property() token!: string;
  @Property() error?: string;
  @Property() errorType?: AuthSteamLoginSocketErrorType;
  @Property() steamid?: string;
  @Property() idUser?: number;
}

export class AuthSteamValidateNamesViewModel {
  @Property() steamPersonaName!: string;
  @Property() newName!: boolean;
}
