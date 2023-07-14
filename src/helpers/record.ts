
/* IMPORT */

import Record from '../nodes/record';
import type {FunctionMaybe, Schema} from '../types';

/* MAIN */

function record <V> ( values?: FunctionMaybe<Schema<V>> ): Record<string, V>;
function record <K extends string, V> ( keys: FunctionMaybe<Schema<K>>, values?: FunctionMaybe<Schema<V>> ): Record<K, V>;
function record <K extends string, V> ( keys?: FunctionMaybe<Schema<K>>, values?: FunctionMaybe<Schema<V>> ) {

  return keys ? ( values ? new Record ({ keys, values }) : new Record ({ values: keys }) ) : new Record ( {} );

}

/* EXPORT */

export default record;
