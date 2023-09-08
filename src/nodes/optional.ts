
/* IMPORT */

import CompoundWithState from './compound_with_state';
import Registry from '../registry';
import {isUndefined} from '../utils';
import type {OptionalState, Traverser, Schema} from '../types';

/* MAIN */

class Optional<T> extends CompoundWithState<T | undefined, T | undefined, OptionalState<T | undefined, T | undefined, T>> {

  /* CONSTRUCTOR */

  constructor ( state: OptionalState<T | undefined, T | undefined, T> ) {

    super ( state, state.optional );

  }

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): T | undefined;
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): T | undefined | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): T | undefined | boolean {

    if ( isUndefined ( value ) ) return value;

    try {

      return this.state.optional.filter ( value, defaultable, quiet );

    } catch {

      return this._filterDefault ( defaultable, quiet );

    }

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
