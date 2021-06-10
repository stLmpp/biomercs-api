export class AuthRegisterViewModel {
  email!: string;
  message!: string;
  idUser!: number;
}

export enum AuthSteamLoginSocketErrorType {
  userNotFound,
  userNotConfirmed,
  userLocked,
  userBanned,
  unknown,
}

export class AuthSteamLoginSocketViewModel {
  uuid!: string;
  token!: string;
  error?: string;
  errorType?: AuthSteamLoginSocketErrorType;
  steamid?: string;
  idUser?: number;
}
