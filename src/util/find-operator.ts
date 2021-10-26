import { FindOperator, Raw } from 'typeorm';

export const NotOrNull = (value: any): FindOperator<any> =>
  Raw(alias => `(${alias} != :notOrNull or ${alias} is null)`, { notOrNull: value });
export const Json = (property: string, value: string): FindOperator<any> =>
  Raw(alias => `${alias} ->> '${property}' = :value`, { value });
