import { Module } from '@nestjs/common';
import { ErrorService } from './error.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorRepository } from './error.repository';
import { ErrorController } from './error.controller';
import { MapperModule } from '../mapper/mapper.module';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [TypeOrmModule.forFeature([ErrorRepository]), MapperModule, EnvironmentModule],
  controllers: [ErrorController],
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule {}
