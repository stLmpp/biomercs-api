export class AuthRegisterViewModel {
  email!: string;
  message!: string;
  idUser!: number;
}

export enum AuthSteamLoginSocketErrorType {
  userNotFound,
  userNotConfirmed,
}

export class AuthSteamLoginSocketViewModel {
  uuid!: string;
  token!: string;
  error?: string;
  errorType?: AuthSteamLoginSocketErrorType;
  steamid?: string;
  idUser?: number;
}
