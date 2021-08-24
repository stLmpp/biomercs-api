import { EntityRepository, Repository } from 'typeorm';
import { SubCategoryTransfer } from './sub-category-transfer.entity';

@EntityRepository(SubCategoryTransfer)
export class SubCategoryTransferRepository extends Repository<SubCategoryTransfer> {}
