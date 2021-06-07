import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Type } from '../util/type';
import { isArray, isFunction } from 'st-utils';
import { plainToClass } from 'class-transformer';
import {
  compilePropertyMetadata,
  getPropertiesMetadata,
  PropertyMetadata,
  toPropertiesObject,
} from './property.decorator';

type MapProperty<T, K extends keyof T = keyof T> = ((entity: T) => any) | K;
type MapTransformer<T, ToType = any> = (entity: T) => ToType;
type MapTransformerMultiple<T, ToType = any> = (entity: T) => ToType[];
interface MapPropertiesMultiple<To, From> {
  keys: (keyof To)[];
  from: MapTransformerMultiple<From>;
}

export class MapProfile<From, To> {
  constructor(private from: Type<From>, private to: Type<To>, private mapperService: MapperService) {
    const fromProperties = getPropertiesMetadata(from);
    const toProperties = getPropertiesMetadata(to);
    this._toPropertiesObj = toPropertiesObject<To>(toProperties.map(toMetadata => toMetadata.propertyKey));
    const intersection: [PropertyMetadata<From>, PropertyMetadata<To>][] = fromProperties.reduce(
      (acc, fromMetadata) => {
        const toMetadata = toProperties.find(toMeta => toMeta.propertyKey === (fromMetadata.propertyKey as any));
        if (toMetadata) {
          acc.push([fromMetadata, toMetadata]);
        }
        return acc;
      },
      [] as [PropertyMetadata, PropertyMetadata][]
    );
    for (const [fromMetadata, toMetadata] of intersection) {
      let callback: MapTransformer<From> = entity => entity[fromMetadata.propertyKey];
      if (this.mapperService.has(fromMetadata.type, toMetadata.type)) {
        callback = entity =>
          this.mapperService.map(fromMetadata.type, toMetadata.type, entity[fromMetadata.propertyKey]);
      }
      this._propertiesMap.set(fromMetadata.propertyKey, callback);
    }
  }

  private readonly _toPropertiesObj: Record<keyof To, keyof To>;
  private readonly _propertiesMap = new Map<any, MapTransformer<From>>();
  private readonly _propertiesMultiple: MapPropertiesMultiple<To, From>[] = [];

  private _mapOne(value: From): To {
    const object: Record<any, any> = {};
    for (const { keys, from } of this._propertiesMultiple) {
      const values = from(value);
      for (let i = 0, len = keys.length; i < len; i++) {
        object[keys[i]] = values[i];
      }
    }
    for (const [key, transform] of this._propertiesMap) {
      object[key] = transform(value);
    }
    return plainToClass(this.to, object);
  }

  private _forMultiple(toKeys: MapProperty<To>[], from: MapTransformerMultiple<From>): this {
    this._propertiesMultiple.push({
      keys: toKeys.map(to => (isFunction(to) ? to(this._toPropertiesObj as any) : to)),
      from,
    });
    return this;
  }

  for(to: MapProperty<To>[], from: MapTransformerMultiple<From>): this;
  for(to: MapProperty<To>, from: MapTransformer<From> | keyof From): this;
  for(
    to: MapProperty<To> | MapProperty<To>[],
    from: MapTransformer<From> | keyof From | MapTransformerMultiple<From>
  ): this {
    if (isArray(to)) {
      return this._forMultiple(to, from as MapTransformerMultiple<From>);
    }
    const keyTo = isFunction(to) ? to(this._toPropertiesObj as any) : to;
    const fromTransformer = isFunction(from) ? from : (entity: From) => entity[from];
    this._propertiesMap.set(keyTo, fromTransformer);
    return this;
  }

  map(value: From): To;
  map(value: From[]): To[];
  map(value: From | From[]): To | To[] {
    if (isArray(value)) {
      return value.map(val => this._mapOne(val));
    } else {
      return this._mapOne(value);
    }
  }
}

@Injectable()
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

  create<From, To>(from: Type<From>, to: Type<To>): MapProfile<From, To> {
    const mapProfile = new MapProfile<From, To>(from, to, this);
    this._getOrCreateProfiles<From, To>(from).set(to, mapProfile);
    return mapProfile;
  }

  map<From, To>(from: Type<From>, to: Type<To>, value: From): To;
  map<From, To>(from: Type<From>, to: Type<To>, value: From[]): To[];
  map<From, To>(from: Type<From>, to: Type<To>, value: From | From[]): To | To[] {
    const mapProfile = this._profiles.get(from)?.get(to);
    if (!mapProfile) {
      throw new InternalServerErrorException(); // TODO BETTER ERROR? MAYBE
    }
    return mapProfile.map(value);
  }

  has<From, To>(from: Type<From>, to: Type<To>): boolean {
    return !!from && !!to && !!this._profiles.get(from)?.has(to);
  }
}
