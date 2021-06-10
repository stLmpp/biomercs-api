import { get } from 'config';
import { version } from '../../package.json';
import { isArray } from 'st-utils';
import { KeyValue } from '../shared/inteface/key-value.interface';
import { genSalt } from 'bcryptjs';
import { resolve } from 'path';

function tryGetEnvVar(property: string): any {
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
    return propertyOrProperties.map(key => ({ key, value: tryGetEnvVar(key) }));
  } else {
    return tryGetEnvVar(propertyOrProperties);
  }
}

export type Configs =
  | 'USE_HANDLE_ERROR'
  | 'USE_ROLE'
  | 'USE_AUTH'
  | 'WEBSOCKET_PATH'
  | 'WEBSOCKET_TRANSPORTS'
  | 'MAIL_QUEUE_AUDIT_TIME'
  | 'MAIL_QUEUE_MAX_RETRIES';

class Env {
  private _salt?: string;

  config<T = any>(config: Configs): T {
    return getEnvVar('CONFIG_' + config);
  }

  getMany(keys: string[]): KeyValue[] {
    return getEnvVar(keys);
  }

  get<T = any>(key: string): T {
    return getEnvVar(key);
  }

  async envSalt(): Promise<string> {
    if (!this._salt) {
      this._salt = await genSalt();
    }
    return this._salt;
  }

  get host(): string {
    return this.get('HOST');
  }

  get port(): number {
    return this.get('PORT');
  }

  get apiUrl(): string {
    // TODO change to https when production
    let url = `http://${this.host}`;
    const port = this.port;
    if (!this.production && port) {
      url += `:${this.port}`;
    }
    return url + '/api';
  }

  get hostFrontEnd(): string {
    return this.get('FRONT_END_HOST');
  }

  get portFrontEnd(): number | undefined {
    return this.get('FRONT_END_PORT');
  }

  get frontEndUrl(): string {
    // TODO change to https when production
    let url = `http://${this.hostFrontEnd}`;
    const frontEndPort = this.portFrontEnd;
    if (!this.production && frontEndPort) {
      url += `:${frontEndPort}`;
    }
    return url;
  }

  get production(): boolean {
    return this.get('NODE_ENV') === 'production';
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

  get entitiesPaths(): string[] {
    const path = this.production ? 'src' : 'dist';
    return [resolve(process.cwd() + `/${path}/**/*.entity.js`)];
  }

  get websocketPath(): string {
    return this.config('WEBSOCKET_PATH');
  }

  get websocketTransports(): string[] {
    return this.config('WEBSOCKET_TRANSPORTS');
  }

  get mail(): string {
    return this.get('MAIL_ADDRESS');
  }

  get mailAuditTime(): number {
    return +this.config('MAIL_QUEUE_AUDIT_TIME');
  }

  get mailOwner(): string {
    return this.get('MAIL_ADDRESS_OWNER');
  }

  get mailQueueMaxRetries(): number {
    return this.config('MAIL_QUEUE_MAX_RETRIES');
  }

  static create(): Env {
    return new Env();
  }
}

export const environment = Env.create();
