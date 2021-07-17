import { Module } from '@nestjs/common';
import { Environment } from './environment';
import { TypeOrmConfig } from './typeorm.config';
import { config } from 'dotenv';

@Module({
  providers: [Environment, TypeOrmConfig],
  exports: [Environment, TypeOrmConfig],
})
export class EnvironmentModule {
  constructor(environment: Environment) {
    if (!environment.production) {
      config();
    }
  }
}
