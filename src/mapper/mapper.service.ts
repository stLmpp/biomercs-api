import { Type } from '../util/type';
import { compilePropertyMetadata } from './property.decorator';
import { MapProfileNotFoundError } from './map-profile-not-found-error';
import { MapProfile } from './map-profile';

export class MapperService {
  constructor() {
    compilePropertyMetadata();
  }

  private _profiles = new Map<Type, Map<Type, MapProfile<any, any>>>();

  private _getOrCreateProfiles<From, To>(from: Type<From>): Map<Type, MapProfile<From, To>> {
    let mapProfiles = this._profiles.get(from);
    if (!mapProfiles) {
      mapProfiles = new Map();
      this._profiles.set(from, mapProfiles);
    }
    return mapProfiles;
  }

  private _getProfileOrFail<From, To>(from: Type<From>, to: Type<To>): MapProfile<From, To> {
    const mapProfile = this._profiles.get(from)?.get(to);
    if (!mapProfile) {
      throw new MapProfileNotFoundError(from, to);
    }
    return mapProfile;
  }

  create<From, To>(from: Type<From>, to: Type<To>): MapProfile<From, To> {
    const mapProfile = new MapProfile<From, To>(from, to, this);
    this._getOrCreateProfiles<From, To>(from).set(to, mapProfile);
    return mapProfile;
  }

  map<From, To>(from: Type<From>, to: Type<To>, value: From): To;
  map<From, To>(from: Type<From>, to: Type<To>, value: From[]): To[];
  map<From, To>(from: Type<From>, to: Type<To>, value: From | From[]): To | To[] {
    return this._getProfileOrFail(from, to).map(value);
  }

  mapPromise<From, To>(from: Type<From>, to: Type<To>, promise: Promise<From>): Promise<To>;
  mapPromise<From, To>(from: Type<From>, to: Type<To>, promise: Promise<From[]>): Promise<To[]>;
  mapPromise<From, To>(from: Type<From>, to: Type<To>, promise: Promise<From | From[]>): Promise<To | To[]> {
    const mapProfile = this._getProfileOrFail(from, to);
    return promise.then(value => mapProfile.map(value));
  }

  has<From, To>(from: Type<From>, to: Type<To>): boolean {
    return !!from && !!to && !!this._profiles.get(from)?.has(to);
  }

  get<From, To>(from: Type<From>, to: Type<To>): MapProfile<From, To> {
    return this._getProfileOrFail(from, to);
  }
}

export const mapperService = new MapperService();
