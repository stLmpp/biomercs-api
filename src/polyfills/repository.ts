import { FindConditions, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { isNumber, isString } from 'st-utils';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

declare module 'typeorm/repository/Repository' {
  interface Repository<Entity> {
    exists(id?: string | number, options?: FindOneOptions<Entity>): Promise<boolean>;
    exists(options?: FindConditions<Entity> | FindConditions<Entity>[]): Promise<boolean>;
    exists(
      idOrOptions?: string | number | FindConditions<Entity> | FindConditions<Entity>[],
      options?: FindOneOptions<Entity>
    ): Promise<boolean>;
    paginate(
      options: IPaginationOptions,
      searchOptions?: FindConditions<Entity> | FindManyOptions<Entity>
    ): Promise<Pagination<Entity>>;
  }
}

Repository.prototype.exists = async function (where: any) {
  if (isNumber(where) || isString(where)) {
    return !!(await this.findOne(where, { select: ['id'] }));
  } else {
    return !!(await this.findOne({ select: ['id'], where }));
  }
};

Repository.prototype.paginate = async function (options, findOptions) {
  return paginate(this, options, findOptions);
};
