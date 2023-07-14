
/* IMPORT */

import Serializer from '../serializer';
import type {Schema} from '../types';

/* MAIN */

const deserialize = <T> ( schema: string ): Schema<T> => {

  return Serializer.deserialize<T> ( schema );

};

/* EXPORT */

export default deserialize;
