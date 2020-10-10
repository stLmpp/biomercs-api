import { FindOperator, Raw } from 'typeorm';

export const LikeLowercase = (value: string): FindOperator<any> => Raw(alias => `lower(${alias}) like lower(${value})`);
export const LikeUppercase = (value: string): FindOperator<any> => Raw(alias => `upper(${alias}) like upper(${value})`);
export const Match = (value: string): FindOperator<any> => Raw(alias => `match(${alias}) against (${value})`);
export const Month = (value: string): FindOperator<any> => Raw(alias => `month(${alias}) = ${value}`);
export const Year = (value: string): FindOperator<any> => Raw(alias => `year(${alias}) = ${value}`);
