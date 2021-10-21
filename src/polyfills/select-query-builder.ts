import { FindConditions, SelectQueryBuilder } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationMeta } from '../shared/view-model/pagination.view-model';

declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    andExists(subQuery: (queryBuilder: SelectQueryBuilder<Entity>) => SelectQueryBuilder<any>): this;
    orExists(subQuery: (queryBuilder: SelectQueryBuilder<Entity>) => SelectQueryBuilder<any>): this;
    andNotExists(subQuery: (queryBuilder: SelectQueryBuilder<Entity>) => SelectQueryBuilder<any>): this;
    orNotExists(subQuery: (queryBuilder: SelectQueryBuilder<Entity>) => SelectQueryBuilder<any>): this;
    fillAndWhere(name: string, dto: FindConditions<Entity>): this;
    paginateRaw<T = any, M = any>(page: number, limit: number): Promise<Pagination<T, M>>;
    paginate<M = any>(page: number, limit: number, route?: string): Promise<Pagination<Entity, M>>;
    getPage(alias: string, id: number, itemsPerPage: number): Promise<number>;
  }
}

SelectQueryBuilder.prototype.andExists = function (subQuery: (arg0: SelectQueryBuilder<any>) => any) {
  return this.andWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.orExists = function (subQuery: (arg0: SelectQueryBuilder<any>) => any) {
  return this.orWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.andNotExists = function (subQuery: (arg0: SelectQueryBuilder<any>) => any) {
  return this.andWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `NOT EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.orNotExists = function (subQuery: (arg0: SelectQueryBuilder<any>) => any) {
  return this.orWhere(sbq => {
    const sb = subQuery(sbq.subQuery().select('1'));
    return `NOT EXISTS ${sb.getQuery()}`;
  });
};

SelectQueryBuilder.prototype.fillAndWhere = function (alias: any, dto: { [s: string]: unknown } | ArrayLike<unknown>) {
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

SelectQueryBuilder.prototype.paginateRaw = async function (page: number, limit: number) {
  const [query, parameters] = this.clone().getQueryAndParameters();
  const offset = (page - 1) * limit;
  const [total, items] = await Promise.all([
    this.connection.query(`SELECT COUNT(1) AS q FROM (${query}) AS COUNTED`, parameters).then(raw => +raw[0].q),
    this.limit(limit).offset(offset).getRawMany(),
  ]);
  const meta: PaginationMeta = {
    currentPage: page,
    itemsPerPage: limit,
    itemCount: items.length,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  };
  return new Pagination(items, meta as any);
};

SelectQueryBuilder.prototype.paginate = async function (page: any, limit: any, route: any) {
  return paginate(this, { page, limit, route });
};

SelectQueryBuilder.prototype.getPage = async function (alias: string, id: number, itemsPerPage: number) {
  const entities = await this.select(`${alias}.id`, 'id').getRawMany<{ id: number }>();
  for (let index = 0; index < entities.length; index++) {
    const idEntity = entities[index].id;
    if (idEntity === id) {
      return Math.ceil((index + 1) / itemsPerPage);
    }
  }
  return -1;
};
