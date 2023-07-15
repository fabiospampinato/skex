
/* IMPORT */

import isEqual from 'are-deeply-equal';
import Registry from './registry';
import type {FunctionMaybe, Schema} from './types';

/* MAIN */

const exit = ( message: string ): never => {

  throw new Error ( message );

};

const findLastIndex = <T> ( values: T[], iterator: ( value: T, index: number, arr: T[] ) => boolean ): number => {

  for ( let i = values.length - 1; i >= 0; i-- ) {

    const value = values[i];

    if ( iterator ( value, i, values ) ) return i;

  }

  return -1;

};

const forOwn = <T> ( object: Record<string, T>, iterator: ( value: T, key: string, object: Record<string, T> ) => void ): void => {

  for ( const key in object ) {

    if ( !object.hasOwnProperty ( key ) ) continue;

    const value = object[key];

    iterator ( value, key, object );

  }

};

const isAny = ( value: unknown ): value is any => {

  return true;

};

const isArray = ( value: unknown ): value is unknown[] => {

  return Array.isArray ( value );

};

const isBigInt = ( value: unknown ): value is bigint => {

  return typeof value === 'bigint';

};

const isBoolean = ( value: unknown ): value is boolean => {

  return typeof value === 'boolean';

};

const isFinite = ( value: unknown ): value is boolean => {

  return Number.isFinite ( value );

};

const isFunction = ( value: unknown ): value is Function => {

  return typeof value === 'function';

};

const isInteger = ( value: unknown ): value is number => {

  return Number.isInteger ( value );

};

const isNaN = ( value: unknown ): boolean => {

  return value !== value;

};

const isNil = ( value: unknown ): value is null | undefined => {

  return value === null || value === undefined;

};

const isNull = ( value: unknown ): value is null => {

  return value === null;

};

const isNumber = ( value: unknown ): value is number => {

  return typeof value === 'number';

};

const isObject = ( value: unknown ): value is object => {

  return typeof value === 'object' && value !== null;

};

const isOptional = ( value: unknown ): boolean => { //TODO: This should be more sophisticated, there could be or([ undefined () ]) for example...

  return ( value instanceof Registry.get ( 'optional' ) ) || ( value instanceof Registry.get ( 'undefined' ) );

};

const isPlainObject = ( value: unknown ): value is Record<string, unknown> => {

  if ( typeof value !== 'object' || value === null ) return false;

  const prototype = Object.getPrototypeOf ( value );

  if ( prototype === null ) return true;

  return Object.getPrototypeOf ( prototype ) === null;

};

const isSchema = ( value: unknown ): value is Schema<unknown> => { //TODO: Not perfect, but good enough for our needs

  return isObject ( value ) && isFunction ( value['filter'] ) && isFunction ( value['test'] ) && isFunction ( value['traverse'] );

};

const isSymbol = ( value: unknown ): value is symbol => {

  return typeof value === 'symbol';

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const isUndefined = ( value: unknown ): value is undefined => {

  return value === undefined;

};

const isUnknown = ( value: unknown ): value is unknown => {

  return true;

};

const resolve = <T> ( value: FunctionMaybe<T> ): T => {

  return isFunction ( value ) ? value () : value;

};

/* EXPORT */

export {exit, findLastIndex, forOwn, isAny, isArray, isBigInt, isBoolean, isFinite, isEqual, isFunction, isInteger, isNaN, isNil, isNull, isNumber, isObject, isOptional, isPlainObject, isSchema, isSymbol, isString, isUndefined, isUnknown, resolve};
