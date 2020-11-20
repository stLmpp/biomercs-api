import { FindConditions, SelectQueryBuilder } from 'typeorm';

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    andExists(subQuery: (queryBuilder: SelectQueryBuilder<Entity>) => SelectQueryBuilder<any>): this;
    orExists(subQuery: (queryBuilder: SelectQueryBuilder<Entity>) => SelectQueryBuilder<any>): this;
    andNotExists(subQuery: (queryBuilder: SelectQueryBuilder<Entity>) => SelectQueryBuilder<any>): this;
    orNotExists(subQuery: (queryBuilder: SelectQueryBuilder<Entity>) => SelectQueryBuilder<any>): this;
    fillAndWhere(name: string, dto: FindConditions<Entity>): this;
  }
}

SelectQueryBuilder.prototype.andExists = function (subQuery) {
  return this.andWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.orExists = function (subQuery) {
  return this.orWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.andNotExists = function (subQuery) {
  return this.andWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `NOT EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.orNotExists = function (subQuery) {
  return this.orWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `NOT EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.fillAndWhere = function (alias, dto) {
  for (const [key, item] of Object.entries(dto)) {
    const isMultiple = key.startsWith('ids');
    let newKey = key;
    let operator = '=';
    let param = `:${key}`;
    if (isMultiple) {
      newKey = key.replace('ids', 'id');
      operator = 'in';
      param = `(:...${key})`;
    }
    this.andWhere(`${alias}.${newKey} ${operator} ${param}`, {
      [key]: item,
    });
  }
  return this;
};
