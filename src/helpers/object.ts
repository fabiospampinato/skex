
/* IMPORT */

import Object from '../nodes/object';
import type {Infer, Schema} from '../types';

/* MAIN */

function object (): Object<{}>;
function object <Properties extends Record<string, Schema>> ( properties: Properties ): Object<{ [K in keyof Properties]: Infer<Properties[K]> }>;
function object <Properties extends Record<string, Schema>> ( properties?: Properties ): Object<{} | { [K in keyof Properties]: Infer<Properties[K]> }> {

  return properties ?  new Object ({ properties: [properties] }) : new Object ( {} );

}

/* EXPORT */

export default object;
