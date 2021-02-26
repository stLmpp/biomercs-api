import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { isNumber, isString } from 'st-utils';

declare module 'typeorm/repository/Repository' {
  interface Repository<Entity> {
    exists(id?: string | number, options?: FindOneOptions<Entity>): Promise<boolean>;
    exists(options?: FindConditions<Entity> | FindConditions<Entity>[]): Promise<boolean>;
    exists(
      idOrOptions?: string | number | FindConditions<Entity> | FindConditions<Entity>[],
      options?: FindOneOptions<Entity>
    ): Promise<boolean>;
  }
}

Repository.prototype.exists = async function (where: any) {
  if (isNumber(where) || isString(where)) {
    return !!(await this.findOne(where, { select: ['id'] }));
  } else {
    return !!(await this.findOne({ select: ['id'], where }));
  }
};
