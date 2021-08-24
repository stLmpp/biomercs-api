export function hasIdDefined<T extends { id?: number }>(dto: T): dto is T & { id: number } {
  return !!dto.id;
}

export function filterId<T extends { id?: number }>(dtos: T[]): (T & { id: number })[] {
  return dtos.filter(hasIdDefined);
}
