
/* IMPORT */

import Array from '../nodes/array';
import type {Schema} from '../types';

/* MAIN */

function array (): Array<unknown>;
function array <T> ( items: Schema<T> ): Array<T>;
function array <T> ( items?: Schema<T> ): Array<T | unknown> {

  return items ? new Array<T> ({ items: [items] }) : new Array ( {} );

}

/* EXPORT */

export default array;
