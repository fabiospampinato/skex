
/* IMPORT */

import Serializer from '../serializer';
import type {Schema} from '../types';

/* MAIN */

const serialize = <T> ( schema: Schema<T> ): string => {

  return Serializer.serialize ( schema );

};

/* EXPORT */

export default serialize;
