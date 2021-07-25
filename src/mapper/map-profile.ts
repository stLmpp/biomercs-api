import { Type } from '../util/type';
import { getPropertiesMetadata, PropertyMetadata, toPropertiesObject } from './property.decorator';
import { plainToClass } from 'class-transformer';
import { isArray, isFunction, isNil } from 'st-utils';
import { MapperService } from './mapper.service';

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
      this._propertiesMap.set(fromMetadata.propertyKey, entity => {
        if (this.mapperService.has(fromMetadata.type, toMetadata.type)) {
          return this.mapperService.map(fromMetadata.type, toMetadata.type, entity[fromMetadata.propertyKey]);
        }
        return entity[fromMetadata.propertyKey];
      });
    }
  }

  private readonly _toPropertiesObj: Record<keyof To, keyof To>;
  private readonly _propertiesMap = new Map<any, MapTransformer<From>>();
  private readonly _propertiesMultiple: MapPropertiesMultiple<To, From>[] = [];

  readonly token = Symbol(`${this.from.name}_${this.to.name}`);

  private _mapOne(value: From): To {
    if (isNil(value)) {
      return value as any;
    }
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
  map(value: From | From[]): To | To[];
  map(value: From | From[]): To | To[] {
    if (isArray(value)) {
      return value.map(val => this._mapOne(val));
    } else {
      return this._mapOne(value);
    }
  }

  mapPromise(promise: Promise<From>): Promise<To>;
  mapPromise(promise: Promise<From[]>): Promise<To[]>;
  mapPromise(promise: Promise<From | From[]>): Promise<To | To[]> {
    return promise.then(value => this.map(value));
  }
}
