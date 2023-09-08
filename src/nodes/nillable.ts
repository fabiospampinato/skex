
/* IMPORT */

import CompoundWithState from './compound_with_state';
import Registry from '../registry';
import {isNil} from '../utils';
import type {NillableState, Traverser, Schema} from '../types';

/* MAIN */

class Nillable<T> extends CompoundWithState<T | null | undefined, T | null | undefined, NillableState<T | null | undefined, T | null | undefined, T>> {

  /* CONSTRUCTOR */

  constructor ( state: NillableState<T | null | undefined, T | null | undefined, T> ) {

    super ( state, state.nillable );

  }

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): T | null | undefined;
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): T | null | undefined | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): T | null | undefined | boolean {

    if ( isNil ( value ) ) return value;

    try {

      return this.state.nillable.filter ( value, defaultable, quiet );

    } catch {

      return this._filterDefault ( defaultable, quiet );

    }

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

/* INIT */

Registry.register ( 'nillable', Nillable );

/* EXPORT */

export default Nillable;
