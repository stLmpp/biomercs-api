export interface TopicInterface {
  id: number;
  name: string;
  idSubCategory: number;
  idScore?: number | null;
  views: number;
  pinned: boolean;
  lockedDate?: Date | null;
}
