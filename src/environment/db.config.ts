import { NamingStategy } from './naming.strategy';
import { environment } from './environment';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DB_TYPEORM_CONFIG: TypeOrmModuleOptions = {
  ...environment.database,
  type: 'mysql',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  logging: !environment.production ? 'all' : false,
  bigNumberStrings: false,
  namingStrategy: new NamingStategy(),
  dropSchema: false,
};
