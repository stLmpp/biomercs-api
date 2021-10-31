import { NotificationExtra } from './notification-extra.view-model';

export interface NotificationInterface {
  id: number;
  content: string;
  idUser: number;
  read: boolean;
  extra?: NotificationExtra | null;
}
