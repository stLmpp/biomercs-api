import { ISortBy, ISortByAscSorter, ISortByDescSorter, ISortByFunction, ISortByObjectSorter } from 'fast-sort';
import * as fastSort from 'fast-sort';

export type OrderByDirection = 'ASC' | 'DESC';

export interface FastSortInstance<T> {
  asc(sortBy?: ISortByFunction<T> | keyof T | (keyof T | ISortByFunction<T>)[] | ISortBy<T>[]): T[];
  desc(sortBy?: ISortByFunction<T> | keyof T | (keyof T | ISortByFunction<T>)[] | ISortBy<T>[]): T[];
  by(sortBy: ISortByAscSorter<T> | ISortByDescSorter<T> | ISortByObjectSorter<T>[]): T[];
}

export function orderBy<T>(
  array: T[],
  sortBy: ISortByFunction<T> | keyof T | (keyof T | ISortByFunction<T>)[] | ISortBy<T>[],
  order?: OrderByDirection
): T[];
export function orderBy<T>(array: T[]): FastSortInstance<T>;
export function orderBy<T>(
  array: T[],
  sortBy?: ISortByFunction<T> | keyof T | (keyof T | ISortByFunction<T>)[] | ISortBy<T>[],
  order: OrderByDirection = 'ASC'
): T[] | FastSortInstance<T> {
  if (sortBy) {
    return ((fastSort as any)(array) as FastSortInstance<T>)[order.toLowerCase() as keyof FastSortInstance<T>](
      sortBy as any
    );
  } else {
    return (fastSort as any)(array);
  }
}
