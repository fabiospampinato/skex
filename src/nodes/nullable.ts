
/* IMPORT */

import Compound from './compound';
import Registry from '../registry';
import {isNull} from '../utils';
import type {NullableState, Traverser, Schema} from '../types';

/* MAIN */

class Nullable<T> extends Compound<T | null, T | null, NullableState<T | null, T | null, T>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): T | null;
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): T | null | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): T | null | boolean {

    if ( isNull ( value ) ) return value;

    try {

      return this.state.nullable.filter ( value, defaultable, quiet );

    } catch {

      return this._filterDefault ( defaultable );

    }

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

/* INIT */

Registry.register ( 'nullable', Nullable );

/* EXPORT */

export default Nullable;
