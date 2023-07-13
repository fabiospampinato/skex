
/* IMPORT */

import Object from '../nodes/object';
import type {FunctionMaybe, Infer, Schema} from '../types';

/* MAIN */

function object (): Object<{}>;
function object <Properties extends Record<string, Schema>> ( properties: FunctionMaybe<Properties> ): Object<{ [K in keyof Properties]: Infer<Properties[K]> }>;
function object <Properties extends Record<string, Schema>> ( properties?: FunctionMaybe<Properties> ): Object<{} | { [K in keyof Properties]: Infer<Properties[K]> }> {

  return properties ?  new Object ({ properties }) : new Object ( {} );

}

/* EXPORT */

export default object;
