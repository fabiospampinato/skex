
/* IMPORT */

import Optional from '../nodes/optional';
import type {Schema} from '../types';

/* MAIN */

const optional = <T> ( optional: Schema<T> ): Optional<T> => {

  return new Optional<T> ({ optional });

};

/* EXPORT */

export default optional;
