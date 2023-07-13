
/* IMPORT */

import Abstract from './abstract';
import {isNull} from '../utils';
import type {NullableState} from '../types';

/* MAIN */

class Nullable<T> extends Abstract<T | null, T | null, NullableState<T | null, T | null, T>> {

  /* MATCHING API */

  filter ( value: unknown ): T | null {

    if ( isNull ( value ) ) return value;

    return this.state.nullable.filter ( value );

  }

  test ( value: unknown ): value is T | null {

    if ( isNull ( value ) ) return true;

    return this.state.nullable.test ( value );

  }

}

/* EXPORT */

export default Nullable;
