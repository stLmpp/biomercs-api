import { Module } from '@nestjs/common';
import { Environment } from './environment';
import { TypeOrmConfig } from './typeorm.config';
import { config } from 'dotenv';
import { resolve } from 'path';

if (process.env.NODE_ENV !== 'production') {
  config({ path: resolve(process.cwd() + '/.env-dev') });
  config();
}

@Module({
  providers: [Environment, TypeOrmConfig],
  exports: [Environment, TypeOrmConfig],
})
export class EnvironmentModule {}
