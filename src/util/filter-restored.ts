export function isRestored<T extends { id?: number; restored: boolean }>(dto: T): dto is T & { id: number } {
  return !!dto.id && dto.restored;
}

export function filterRestored<T extends { id?: number; restored: boolean }>(dtos: T[]): (T & { id: number })[] {
  return dtos.filter(isRestored);
}
