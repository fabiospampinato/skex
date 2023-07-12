
/* IMPORT */

import {isEqual, resolve} from './utils';
import type {FunctionMaybe} from './types';

/* MAIN */

const anyOf = ( value: unknown, values: FunctionMaybe<unknown[]> ): boolean => {

  return resolve ( values ).some ( other => isEqual ( value, other ) );

};

const noneOf = ( value: unknown, values: FunctionMaybe<unknown[]> ): boolean => {

  return !anyOf ( value, values );

};

/* EXPORT */

export {anyOf, noneOf};
