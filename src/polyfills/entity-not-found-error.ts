import { EntityNotFoundError, SelectQueryBuilder } from 'typeorm';

// TODO check if typeorm has changed the signature of this

(EntityNotFoundError.prototype as any).stringifyCriteria = function (criteria: any) {
  if (criteria instanceof SelectQueryBuilder) {
    const [query, parameters] = criteria.getQueryAndParameters();
    this.query = query;
    this.parameters = parameters;
  }
  try {
    return JSON.stringify(criteria, null, 4);
  } catch (e) {}
  return '' + criteria;
};
