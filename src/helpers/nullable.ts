
/* IMPORT */

import Nullable from '../nodes/nullable';
import type {Schema} from '../types';

/* MAIN */

const nullable = <T> ( nullable: Schema<T> ): Nullable<T> => {

  return new Nullable<T> ({ nullable });

};

/* EXPORT */

export default nullable;
