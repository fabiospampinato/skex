
/* IMPORT */

import Compound from './compound';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {exit} from '../utils';
import type {OrState, Schema, Tests, Traverser} from '../types';

/* MAIN */

//TODO: Support filtering, shomehow

class Or<T> extends Compound<unknown, T, OrState<T, T, unknown>> {

  /* PUBLIC API */

  filter ( value: unknown ): T {

    return exit ( 'The "or" operator does not support filtering, yet' );

  }

  test ( value: unknown ): value is T {

    return super.test ( value, TESTS );

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

/* EXPORT */

export default Or;
