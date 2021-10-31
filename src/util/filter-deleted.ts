export function isDeleted<T extends { id?: number; deleted: boolean }>(dto: T): dto is T & { id: number } {
  return !!dto.id && dto.deleted;
}

export function filterDeleted<T extends { id?: number; deleted: boolean }>(dtos: T[]): (T & { id: number })[] {
  return dtos.filter(isDeleted);
}
