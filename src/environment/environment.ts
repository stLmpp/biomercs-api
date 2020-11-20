import { get } from 'config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { version } from '../../package.json';
import { isArray } from 'lodash';
import { KeyValue } from '../shared/inteface/key-value.interface';

function _getEnvVar(property: string): any {
  try {
    return get(property);
  } catch {
    return process.env[property];
  }
}

function getEnvVar(properties: string[]): { key: string; value: any }[];
function getEnvVar(property: string): any;
function getEnvVar(propertyOrProperties: string | string[]): any {
  if (isArray(propertyOrProperties)) {
    return propertyOrProperties.map(key => ({ key, value: _getEnvVar(key) }));
  } else {
    return _getEnvVar(propertyOrProperties);
  }
}

export type Configs =
  | 'FILE_IMAGE_EXTENSIONS_ALLOWED'
  | 'USE_HANDLE_ERROR'
  | 'USE_ROLE'
  | 'USE_AUTH'
  | 'FILE_UPLOAD_PATH';

class Env {
  config<T = any>(config: Configs): T {
    return getEnvVar('CONFIG_' + config);
  }

  getMany(keys: string[]): KeyValue[] {
    return getEnvVar(keys);
  }

  get<T = any>(key: string): T {
    return getEnvVar(key);
  }

  get host(): string {
    return getEnvVar('HOST');
  }

  get port(): string {
    return getEnvVar('PORT');
  }

  get database(): MysqlConnectionOptions {
    return this.getMany([
      'DB_HOST',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_DATABASE',
      'DB_SYNCHRONIZE',
      'DB_CHARSET',
    ]).reduce((dbConfig, { key, value }) => {
      return {
        ...dbConfig,
        [key.replace('DB_', '').toLowerCase()]: value,
      };
    }, {}) as MysqlConnectionOptions;
  }

  get production(): boolean {
    return getEnvVar('NODE_ENV') === 'production';
  }

  get defaultPaginationSize(): number {
    return this.get('DEFAULT_PAGINATION_SIZE');
  }

  get appVersion(): string {
    return version;
  }

  get steamOpenIDUrl(): string {
    return this.get('STEAM_OPENID_URL');
  }

  get steamKey(): string {
    return this.get('STEAM_API_KEY');
  }

  static create(): Env {
    return new Env();
  }
}

export const environment = Env.create();
