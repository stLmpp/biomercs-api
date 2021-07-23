import { Injectable } from '@nestjs/common';
import { ErrorAddDto } from './error.dto';
import { ErrorEntity } from './error.entity';
import { ErrorRepository } from './error.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindConditions, LessThan } from 'typeorm';
import { subDays } from 'date-fns';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class ErrorService {
  constructor(private errorRepository: ErrorRepository) {}

  @Cron(CronExpression.EVERY_WEEK)
  async deleteOldErrors(): Promise<void> {
    const where: FindConditions<ErrorEntity> = { creationDate: LessThan(subDays(new Date(), 7)) };
    await this.errorRepository.delete(where);
  }

  async add(dto: ErrorAddDto): Promise<ErrorEntity> {
    return this.errorRepository.save(dto);
  }

  async paginate(page: number, limit: number): Promise<Pagination<ErrorEntity>> {
    return this.errorRepository.paginate(
      { page, limit },
      { order: { creationDate: 'DESC' }, relations: ['createdByUser'] }
    );
  }
}
