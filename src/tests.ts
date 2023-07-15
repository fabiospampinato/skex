
/* IMPORT */

import {isEqual, resolve} from './utils';
import type {FunctionMaybe} from './types';

/* MAIN */

//TODO: Maybe an isLike kind of check should be performed instead while testing, to allow extra properties

const anyOf = ( value: unknown, values: FunctionMaybe<unknown[]> ): boolean => {

  return resolve ( values ).some ( other => isEqual ( value, other ) );

};

const noneOf = ( value: unknown, values: FunctionMaybe<unknown[]> ): boolean => {

  return !anyOf ( value, values );

};

/* EXPORT */

export {anyOf, noneOf};
