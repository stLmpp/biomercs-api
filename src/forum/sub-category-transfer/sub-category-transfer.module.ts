import { Module } from '@nestjs/common';
import { SubCategoryTransferService } from './sub-category-transfer.service';
import { SubCategoryTransferController } from './sub-category-transfer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryTransferRepository } from './sub-category-transfer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoryTransferRepository])],
  providers: [SubCategoryTransferService],
  controllers: [SubCategoryTransferController],
  exports: [SubCategoryTransferService],
})
export class SubCategoryTransferModule {}
