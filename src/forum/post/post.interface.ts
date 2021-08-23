export interface PostInterface {
  id: number;
  post: string;
  idTopic: number;
  idPlayer: number;
  deletedDate?: Date | null;
}
