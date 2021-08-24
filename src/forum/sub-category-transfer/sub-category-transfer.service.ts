import { Injectable } from '@nestjs/common';
import { SubCategoryTransferRepository } from './sub-category-transfer.repository';
import { SubCategoryTransfer } from './sub-category-transfer.entity';
import { SubCategoryTransferAddDto } from './sub-category-transfer.dto';

@Injectable()
export class SubCategoryTransferService {
  constructor(private subCategoryTransferRepository: SubCategoryTransferRepository) {}

  async add(dto: SubCategoryTransferAddDto): Promise<SubCategoryTransfer> {
    return this.subCategoryTransferRepository.save(dto);
  }
}
