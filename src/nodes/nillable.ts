
/* IMPORT */

import Compound from './compound';
import {isNil} from '../utils';
import type {NillableState, Traverser, Schema} from '../types';

/* MAIN */

class Nillable<T> extends Compound<T | null | undefined, T | null | undefined, NillableState<T | null | undefined, T | null | undefined, T>> {

  /* PUBLIC API */

  filter ( value: unknown ): T | null | undefined {

    if ( isNil ( value ) ) return value;

    return this.state.nillable.filter ( value );

  }

  test ( value: unknown ): value is T | null | undefined {

    if ( isNil ( value ) ) return true;

    return this.state.nillable.test ( value );

  }

  traverse ( traverser: Traverser, parent?: Schema, key?: string | number ): void {

    traverser ( this, parent, key );

    this.state.nillable.traverse ( traverser, this );

  }

}

/* EXPORT */

export default Nillable;
