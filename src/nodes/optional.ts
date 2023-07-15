
/* IMPORT */

import Compound from './compound';
import Registry from '../registry';
import {isUndefined} from '../utils';
import type {OptionalState, Traverser, Schema} from '../types';

/* MAIN */

class Optional<T> extends Compound<T | undefined, T | undefined, OptionalState<T | undefined, T | undefined, T>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: boolean = true ): T | undefined {

    if ( isUndefined ( value ) ) return value;

    return this.state.optional.filter ( value, defaultable );

  }

  test ( value: unknown ): value is T | undefined {

    if ( isUndefined ( value ) ) return true;

    return this.state.optional.test ( value );

  }

  traverse ( traverser: Traverser, parent?: Schema, key?: string | number ): void {

    traverser ( this, parent, key );

    this.state.optional.traverse ( traverser, this );

  }

}

/* INIT */

Registry.register ( 'optional', Optional );

/* EXPORT */

export default Optional;
