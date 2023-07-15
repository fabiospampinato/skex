
/* IMPORT */

import Compound from './compound';
import Nillable from './nillable';
import Nullable from './nullable';
import Optional from './optional';
import Primitive from './primitive';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {exit} from '../utils';
import type {OrState, Schema, Tests, Traverser} from '../types';

/* MAIN */

//TODO: Support filtering compound operators, shomehow

class Or<T> extends Compound<unknown, T, OrState<T, T, unknown>> {

  /* VARIABLES */

  protected filterable?: boolean;

  /* PUBLIC API */

  filter ( value: unknown, defaultable: boolean = true ): T {

    this.filterable ??= this.state.options.every ( option => option instanceof Primitive );

    if ( !this.filterable ) return exit ( 'The "or" operator only supports filtering primitives' );

    for ( let i = 0, l = this.state.options.length; i < l; i++ ) {

      try {

        return this.state.options[i].filter ( value, false );

      } catch ( error: unknown ) {

        if ( i === l - 1 ) {

          return this._filterDefault ( defaultable );

        }

      }

    }

    return value;

  }

  test ( value: unknown ): value is T {

    return super._test ( value, TESTS );

  }

  traverse ( traverser: Traverser, parent?: Schema, key?: string | number ): void {

    traverser ( this, parent, key );

    this.state.options.forEach ( option => {

      option.traverse ( traverser, this );

    });

  }

  /* GENERIC TESTS API */

  anyOf ( values: T[] ): Or<T> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: T[] ): Or<T> {

    return this.with ({ noneOf: values });

  }

  nillable (): Nillable<T> {

    return new Nillable ({ nillable: this });

  }

  nullable (): Nullable<T> {

    return new Nullable ({ nullable: this });

  }

  optional (): Optional<T> {

    return new Optional ({ optional: this });

  }

}

/* UTILITIES */

const TESTS: Tests<unknown, OrState<unknown, unknown, unknown>> = {
  anyOf,
  noneOf,
  options: ( value, schemas ) => schemas.some ( option => option.test ( value ) )
};

/* INIT */

Registry.register ( 'or', Or );

/* EXPORT */

export default Or;
