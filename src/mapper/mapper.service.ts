import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Type } from '../util/type';
import { getMetadataArgsStorage } from 'typeorm';
import { isArray, isFunction, uniq } from 'st-utils';
import { plainToClass } from 'class-transformer';

export function Property(): PropertyDecorator {
  return (target, propertyKey) => {
    const properties = storeProperties.get(target.constructor as any) ?? [];
    storeProperties.set(target.constructor as any, [...properties, propertyKey.toString()]);
  };
}

function getProperties<T>(type: Type<T>): (keyof T)[] {
  const parent = Object.getPrototypeOf(type).constructor;
  return uniq([
    ...getMetadataArgsStorage()
      .filterColumns(type)
      .map(value => value.propertyName),
    ...getMetadataArgsStorage()
      .filterRelations(type)
      .map(value => value.propertyName),
    ...getMetadataArgsStorage()
      .columns.filter(column => type.prototype instanceof (column.target as any))
      .map(column => column.propertyName),
    ...(storeProperties.get(type) ?? []),
    ...(storeProperties.get(parent) ?? []),
  ]) as (keyof T)[];
}

function toPropertiesObject<T, K extends keyof T = keyof T>(keys: K[]): Record<K, K> {
  return keys.reduce((acc, key) => ({ ...acc, [key]: key }), {} as Record<K, K>);
}

type MapProperty<T, K extends keyof T = keyof T> = ((entity: T) => T[K]) | K;
type MapTransformer<T, ToType = any> = (entity: T) => ToType;

class MapProfile<From, To> {
  constructor(private from: Type<From>, private to: Type<To>) {
    this._fromProperties = getProperties(from);
    this._toProperties = getProperties(to);
    this._fromPropertiesObj = toPropertiesObject<From>(this._fromProperties);
    this._toPropertiesObj = toPropertiesObject<To>(this._toProperties);
    const intersection = this._fromProperties.filter(fromKey => this._toProperties.includes(fromKey as any));
    for (const property of intersection) {
      this._propertiesMap.set(property, entity => entity[property]);
    }
  }

  private readonly _fromProperties: (keyof From)[];
  private readonly _toProperties: (keyof To)[];
  private readonly _fromPropertiesObj: Record<keyof From, keyof From>;
  private readonly _toPropertiesObj: Record<keyof To, keyof To>;
  private _propertiesMap = new Map<keyof From, MapTransformer<From>>();

  private _mapOne(value: From): To {
    const object: Record<any, any> = {};
    for (const [key, transform] of this._propertiesMap) {
      object[key] = transform(value);
    }
    return plainToClass(this.to, object);
  }

  for(to: MapProperty<To>, from: MapTransformer<From> | keyof From): this {
    const keyTo = isFunction(to) ? (to(this._toPropertiesObj as any) as any) : to;
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
    const mapProfile = new MapProfile<From, To>(from, to);
    this._getOrCreateProfiles<From, To>(from).set(to, mapProfile);
    return mapProfile;
  }

  map<From, To>(from: Type<From>, to: Type<To>, value: From): To;
  map<From, To>(from: Type<From>, to: Type<To>, value: From[]): To[];
  map<From, To>(from: Type<From>, to: Type<To>, value: From | From[]): To | To[] {
    const mapProfile = this._profiles.get(from)?.get(to);
    if (!mapProfile) {
      throw new InternalServerErrorException();
    }
    return mapProfile.map(value);
  }
}

const storeProperties = new Map<Type, string[]>();
