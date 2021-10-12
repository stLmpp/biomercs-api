export interface PostInterface {
  id: number;
  content: string;
  idTopic: number;
  idPlayer: number;
  deletedDate?: Date | null;
}
