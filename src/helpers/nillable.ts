
/* IMPORT */

import Nillable from '../nodes/nillable';
import type {Schema} from '../types';

/* MAIN */

const nillable = <T> ( nillable: Schema<T> ): Nillable<T> => {

  return new Nillable<T> ({ nillable });

};

/* EXPORT */

export default nillable;
