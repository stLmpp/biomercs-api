import { FindOperator, Raw } from 'typeorm';

export const LikeLowercase = (value: string): FindOperator<any> =>
  Raw(alias => `lower(${alias}) like lower(:likeLowercase)`, { likeLowercase: value });
export const LikeUppercase = (value: string): FindOperator<any> =>
  Raw(alias => `upper(${alias}) like upper(:likeUppercase)`, { likeUppercase: value });
export const Match = (value: string): FindOperator<any> =>
  Raw(alias => `match(${alias}) against (:match)`, { match: value });
export const Month = (value: string): FindOperator<any> => Raw(alias => `month(${alias}) = :month`, { month: value });
export const Year = (value: string): FindOperator<any> => Raw(alias => `year(${alias}) = :year`, { year: value });
export const SimpleArrayEquals = (value: any[]): FindOperator<any> =>
  Raw(alias => `${alias} = :simpleArray`, { simpleArray: value.join(',') });
export const NotOrNull = (value: any): FindOperator<any> =>
  Raw(alias => `(${alias} != :notOrNull or ${alias} is null)`, { notOrNull: value });
