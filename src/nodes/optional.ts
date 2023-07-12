
/* IMPORT */

import Abstract from './abstract';
import {isUndefined} from '../utils';
import type {OptionalState} from '../types';

/* MAIN */

class Optional<T> extends Abstract<T | undefined, T | undefined, OptionalState<T | undefined, T | undefined, T>> {

  /* MATCHING API */

  filter ( value: unknown ): T | undefined {

    if ( isUndefined ( value ) ) return value;

    return this.states.optional[0].filter ( value );

  }

  test ( value: unknown ): value is T | undefined {

    if ( isUndefined ( value ) ) return true;

    return this.states.optional[0].test ( value );

  }

}

/* EXPORT */

export default Optional;
