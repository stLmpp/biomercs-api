export interface NotificationInterface {
  content: string;
  idUser: number;
  read: boolean;
  idScore?: number | null;
}
