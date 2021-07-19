import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Environment } from './environment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private environment: Environment) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.environment.getTypeOrmConfig();
  }
}
