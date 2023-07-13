
/* IMPORT */

import Abstract from './abstract';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {exit} from '../utils';
import type {AndState, Tests} from '../types';

/* MAIN */

//TODO: Support filtering, shomehow

class And<T> extends Abstract<unknown, T, AndState<T, T, unknown>> {

  /* PUBLIC API */

  filter ( value: unknown ): T {

    return exit ( 'The "and" operator does not support filtering, yet' );

  }

  test ( value: unknown ): value is T {

    return super.test ( value, TESTS );

  }

  /* GENERIC TESTS API */

  anyOf ( values: T[] ): And<T> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: T[] ): And<T> {

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

const TESTS: Tests<unknown, AndState<unknown, unknown, unknown>> = {
  anyOf,
  noneOf,
  options: ( value, schemas ) => schemas.every ( option => option.test ( value ) )
};

/* EXPORT */

export default And;
