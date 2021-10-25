import { Module } from '@nestjs/common';
import { PostHistoryService } from './post-history.service';
import { PostHistoryController } from './post-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostHistoryRepository } from './post-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PostHistoryRepository])],
  providers: [PostHistoryService],
  controllers: [PostHistoryController],
  exports: [PostHistoryService],
})
export class PostHistoryModule {}
