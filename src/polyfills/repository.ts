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

Repository.prototype.exists = async function (where, options?: FindOneOptions) {
  if (isNumber(where) || isString(where)) {
    return !!(await this.findOne(where, { ...options, select: ['id'] }));
  } else {
    return !!(await this.findOne({ ...options, select: ['id'], where }));
  }
};

Repository.prototype.paginate = async function (
  options: IPaginationOptions,
  findOptions: FindConditions<any> | FindManyOptions | undefined
) {
  return paginate(this, options, findOptions);
};
