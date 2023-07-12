
/* IMPORT */

import isEqual from 'are-deeply-equal';
import type {FunctionMaybe} from './types';

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

const isFunction = ( value: unknown ): value is Function => {

  return typeof value === 'function';

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

const isPlainObject = ( value: unknown ): value is Record<string, unknown> => {

  if ( typeof value !== 'object' || value === null ) return false;

  const prototype = Object.getPrototypeOf ( value );

  if ( prototype === null ) return true;

  return Object.getPrototypeOf ( prototype ) === null;

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

export {exit, findLastIndex, isAny, isArray, isBigInt, isBoolean, isEqual, isFunction, isNaN, isNil, isNull, isNumber, isPlainObject, isSymbol, isString, isUndefined, isUnknown, resolve};
