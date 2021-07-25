import { Module } from '@nestjs/common';
import { Environment } from './environment';
import { TypeOrmConfig } from './typeorm.config';
import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config();
}

@Module({
  providers: [Environment, TypeOrmConfig],
  exports: [Environment, TypeOrmConfig],
})
export class EnvironmentModule {}
