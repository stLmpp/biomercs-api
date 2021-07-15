import { Injectable } from '@nestjs/common';
import { ErrorAddDto } from './error.dto';
import { ErrorEntity } from './error.entity';
import { isFunction } from 'st-utils';
import { ErrorRepository } from './error.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindConditions, LessThan } from 'typeorm';
import { subDays } from 'date-fns';

@Injectable()
export class ErrorService {
  constructor(private errorRepository: ErrorRepository) {}

  @Cron(CronExpression.EVERY_WEEK)
  async deleteOldErrors(): Promise<void> {
    const where: FindConditions<ErrorEntity> = { creationDate: LessThan(subDays(new Date(), 7)) };
    await this.errorRepository.delete(where);
  }

  async add(dto: ErrorAddDto): Promise<ErrorEntity> {
    if (dto.sqlParameters?.length) {
      dto.sqlParameters = dto.sqlParameters.map(param => {
        if (isFunction(param?.toString)) {
          return param.toString();
        } else {
          return `${param}`;
        }
      });
    }
    return this.errorRepository.save(dto);
  }
}
