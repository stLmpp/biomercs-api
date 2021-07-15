import { Module } from '@nestjs/common';
import { ErrorService } from './error.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorRepository } from './error.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ErrorRepository])],
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule {}
