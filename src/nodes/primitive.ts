
/* IMPORT */

import Abstract from './abstract';
import type {AbstractState} from '../types';

/* MAIN */

// This is just a node in the propotype chain useful for brand-checking primitive nodes

class Primitive<BaseType extends unknown, FullType extends BaseType, State extends AbstractState<BaseType, FullType>> extends Abstract<BaseType, FullType, State> {}

/* EXPORT */

export default Primitive;
