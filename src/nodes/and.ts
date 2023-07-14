
/* IMPORT */

import Compound from './compound';
import Nillable from './nillable';
import Nullable from './nullable';
import Optional from './optional';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {exit} from '../utils';
import type {AndState, Schema, Tests, Traverser} from '../types';

/* MAIN */

//TODO: Support filtering, especially compound operators, shomehow (unclear if it makes sense though)

class And<T> extends Compound<unknown, T, AndState<T, T, unknown>> {

  /* PUBLIC API */

  filter ( value: unknown ): T {

    return exit ( 'The "and" operator does not support filtering' );

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

  anyOf ( values: T[] ): And<T> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: T[] ): And<T> {

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

const TESTS: Tests<unknown, AndState<unknown, unknown, unknown>> = {
  anyOf,
  noneOf,
  options: ( value, schemas ) => schemas.every ( option => option.test ( value ) )
};

/* INIT */

Registry.register ( 'and', And );

/* EXPORT */

export default And;
