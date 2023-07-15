
/* IMPORT */

import Compound from './compound';
import Registry from '../registry';
import {isNil} from '../utils';
import type {NillableState, Traverser, Schema} from '../types';

/* MAIN */

class Nillable<T> extends Compound<T | null | undefined, T | null | undefined, NillableState<T | null | undefined, T | null | undefined, T>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: boolean = true ): T | null | undefined {

    if ( isNil ( value ) ) return value;

    try {

      return this.state.nillable.filter ( value, defaultable );

    } catch {

      return this._filterDefault ( defaultable );

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
