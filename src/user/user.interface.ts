export interface UserInterface {
  id: number;
  username: string;
  email: string;
  lastOnline?: Date | null;
  rememberMe?: boolean;
  admin: boolean;
  dateFormat: string;
  token?: string;
  bannedDate?: Date | null;
}
