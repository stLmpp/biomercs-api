export interface PostInterface {
  id: number;
  post: object;
  idTopic: number;
  idPlayer: number;
  deletedDate?: Date | null;
}
