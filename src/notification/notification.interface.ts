export interface NotificationInterface {
  id: number;
  content: string;
  idUser: number;
  read: boolean;
  idScore?: number | null;
}
