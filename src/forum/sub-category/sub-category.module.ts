import { forwardRef, Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryRepository } from './sub-category.repository';
import { SubCategoryTransferModule } from '../sub-category-transfer/sub-category-transfer.module';
import { EnvironmentModule } from '../../environment/environment.module';
import { MapperModule } from '../../mapper/mapper.module';
import { ModeratorModule } from '../moderator/moderator.module';
import { UserModule } from '../../user/user.module';
import { TopicModule } from '../topic/topic.module';
import { PlayerModule } from '../../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategoryRepository]),
    SubCategoryTransferModule,
    EnvironmentModule,
    MapperModule,
    ModeratorModule,
    UserModule,
    forwardRef(() => TopicModule),
    forwardRef(() => PlayerModule),
  ],
  providers: [SubCategoryService],
  controllers: [SubCategoryController],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
