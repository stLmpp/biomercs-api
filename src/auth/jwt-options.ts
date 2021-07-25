import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Environment } from '../environment/environment';

@Injectable()
export class JwtOptions implements JwtOptionsFactory {
  constructor(private environment: Environment) {}

  createJwtOptions(): JwtModuleOptions {
    return this.environment.getJwtOptions();
  }
}
