
/* IMPORT */

import Array from '../nodes/array';
import type {FunctionMaybe, Schema} from '../types';

/* MAIN */

function array (): Array<unknown>;
function array <T> ( items: FunctionMaybe<Schema<T>> ): Array<T>;
function array <T> ( items?: FunctionMaybe<Schema<T>> ): Array<T | unknown> {

  return items ? new Array<T> ({ items: [items] }) : new Array ( {} );

}

/* EXPORT */

export default array;
