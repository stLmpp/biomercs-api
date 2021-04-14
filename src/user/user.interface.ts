export interface UserInterface {
  id: number;
  username: string;
  email: string;
  lastOnline?: Date;
  rememberMe?: boolean;
  admin: boolean;
  dateFormat: string;
  token?: string;
}
