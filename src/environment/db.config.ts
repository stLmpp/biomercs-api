import { NamingStategy } from './naming.strategy';
import { environment } from './environment';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { resolve } from 'path';

export const DB_TYPEORM_CONFIG: TypeOrmModuleOptions = {
  host: environment.get('DB_HOST'),
  port: environment.get('DB_PORT'),
  username: environment.get('DB_USERNAME'),
  password: environment.get('DB_PASSWORD'),
  database: environment.get('DB_DATABASE'),
  synchronize: environment.get('DB_SYNCHRONIZE'),
  type: 'postgres',
  entities: [resolve(process.cwd() + '/dist/**/*.entity.js')],
  logging: !environment.production ? 'all' : false,
  namingStrategy: new NamingStategy(),
  dropSchema: false,
  migrations: [resolve(process.cwd() + '/migration/*.js')],
  cli: { migrationsDir: 'migration' },
};
