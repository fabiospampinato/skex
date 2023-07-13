
/* IMPORT */

import Abstract from './abstract';
import {isNull} from '../utils';
import type {NullableState, Traverser, Schema} from '../types';

/* MAIN */

class Nullable<T> extends Abstract<T | null, T | null, NullableState<T | null, T | null, T>> {

  /* PUBLIC API */

  filter ( value: unknown ): T | null {

    if ( isNull ( value ) ) return value;

    return this.state.nullable.filter ( value );

  }

  test ( value: unknown ): value is T | null {

    if ( isNull ( value ) ) return true;

    return this.state.nullable.test ( value );

  }

  traverse ( traverser: Traverser, parent?: Schema, key?: string | number ): void {

    traverser ( this, parent, key );

    this.state.nullable.traverse ( traverser, this );

  }

}

/* EXPORT */

export default Nullable;
