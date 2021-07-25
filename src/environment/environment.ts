import { get, has } from 'config';
import { genSalt } from 'bcrypt';
import { resolve } from 'path';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NamingStrategy } from './naming.strategy';
import { version } from '../../package.json';
import { JwtModuleOptions } from '@nestjs/jwt';
import { getPropertiesMetadata, Property } from '../mapper/property.decorator';
import { isUndefined } from 'st-utils';

export class EnvironmentVariables {
  @Property() DB_DATABASE!: string;
  @Property() DB_HOST!: string;
  @Property() DB_PASSWORD!: string;
  @Property() DB_PORT!: number;
  @Property() DB_SYNCHRONIZE!: boolean;
  @Property() DB_USERNAME!: string;
  @Property() FRONT_END_HOST!: string;
  @Property(() => Number, true) FRONT_END_PORT: number | undefined;
  @Property() HOST!: string;
  @Property() JWT_EXPIRES_IN!: number;
  @Property() JWT_SECRET!: string;
  @Property() MAIL_ADDRESS!: string;
  @Property() MAIL_ADDRESS_OWNER!: string;
  @Property() MAIL_AWS_ACCESS_KEY_ID!: string;
  @Property() MAIL_AWS_API_VERSION!: string;
  @Property() MAIL_AWS_REGION!: string;
  @Property() MAIL_AWS_SECRET_ACCESS_KEY!: string;
  @Property() MAIL_QUEUE_AUDIT_TIME!: number;
  @Property() MAIL_QUEUE_MAX_RETRIES!: number;
  @Property() NODE_ENV!: 'production' | 'development';
  @Property() PORT!: number;
  @Property() SECRET_CHAR!: string;
  @Property() STEAM_API_KEY!: string;
  @Property() STEAM_OPENID_URL!: string;
  @Property() USERNAME_OWNER!: string;
  @Property() USE_AUTH!: boolean;
  @Property() USE_ERROR_FILTER!: boolean;
  @Property() WEBSOCKET_PATH!: string;
  @Property() WEBSOCKET_TRANSPORTS!: Array<'polling' | 'websocket'>;
}

@Injectable()
export class Environment {
  constructor() {
    const properties = getPropertiesMetadata(EnvironmentVariables);
    for (const { propertyKey, type, possibleUndefined } of properties) {
      let value = this._get(propertyKey);
      if (type !== String) {
        switch (type) {
          case Number: {
            if (!isUndefined(value)) {
              value = Number(value);
            }
            break;
          }
          case Boolean:
            value = value === true || value === 'true';
            break;
        }
      }
      if (isUndefined(value) && !possibleUndefined) {
        throw new InternalServerErrorException(`Environment variable "${propertyKey}" not found!`);
      }
      this._cache.set(propertyKey, value);
    }

    this.production = this.get('NODE_ENV') === 'production';
    this.http = 'http' + (this.production ? 's' : '');
    this.apiUrl = this._getUrl(this.get('HOST'), this.get('PORT')) + '/api';
    this.frontEndUrl = this._getUrl(this.get('FRONT_END_HOST'), this.get('FRONT_END_PORT'));
  }

  private _salt?: string;
  private readonly _cache = new Map<keyof EnvironmentVariables, EnvironmentVariables[keyof EnvironmentVariables]>();

  readonly production: boolean;
  readonly http: string;
  readonly apiUrl: string;
  readonly frontEndUrl: string;
  readonly appVersion = version;

  private _getUrl(host: string, port?: number): string {
    let url = `${this.http}://${host}`;
    if (!this.production && port) {
      url += `:${port}`;
    }
    return url;
  }

  private _get<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] | string | undefined {
    const param = this.normalizeKey(key);
    if (has(param)) {
      return get(param);
    } else {
      return process.env[param];
    }
  }

  normalizeKey(key: keyof EnvironmentVariables): string {
    return normalizeEnvironmentKey(key);
  }

  get<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] {
    return this._cache.get(key) as EnvironmentVariables[K];
  }

  async envSalt(): Promise<string> {
    if (!this._salt) {
      this._salt = await genSalt();
    }
    return this._salt;
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      host: this.get('DB_HOST'),
      port: this.get('DB_PORT'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_DATABASE'),
      synchronize: this.get('DB_SYNCHRONIZE'),
      type: 'postgres',
      autoLoadEntities: true,
      logging: !this.production ? 'all' : false,
      namingStrategy: new NamingStrategy(),
      dropSchema: false,
      migrations: [resolve(process.cwd() + '/migration/*.js')],
      cli: { migrationsDir: 'migration' },
    };
  }

  getJwtOptions(): JwtModuleOptions {
    return {
      secret: this.get('JWT_SECRET'),
      signOptions: {
        expiresIn: this.get('JWT_EXPIRES_IN'),
      },
    };
  }
}

export function normalizeEnvironmentKey(key: string): string {
  if (key === 'NODE_ENV') {
    return key;
  }
  return 'BIO_' + key.toString();
}
