
/* IMPORT */

import Abstract from './abstract';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {exit, isArray} from '../utils';
import type {ArrayState, Schema, Tests} from '../types';

/* MAIN */

class Array<T> extends Abstract<unknown[], T[], ArrayState<T[], unknown>> {

  /* MATCHING API */

  filter ( value: unknown ): T[] {

    if ( !isArray ( value ) ) exit ( 'Filtering failed' );

    return super.filter ( value, FILTERS );

  }

  test ( value: unknown ): value is T[] {

    return isArray ( value ) && super.test ( value, TESTS );

  }

  /* GENERIC TESTS API */

  anyOf ( values: T[][] ): Array<T> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: T[][] ): Array<T> {

    return this.with ({ noneOf: values });

  }

  nullable (): Nullable<T[]> {

    return new Nullable ({ nullable: [this] });

  }

  optional (): Optional<T[]> {

    return new Optional ({ optional: [this] });

  }

  /* SPECIFIC TESTS API */

  items <U> ( items: Schema<U> ): Array<T & U> {

    return this.with ({ items });

  }

  length ( value: number ): Array<T> {

    return this.with ({ min: value, max: value });

  }

  max ( value: number ): Array<T> {

    return this.with ({ max: value });

  }

  min ( value: number ): Array<T> {

    return this.with ({ min: value });

  }

}

/* UTILITIES */

const TESTS: Tests<unknown[], ArrayState<unknown[], unknown>> = {
  anyOf,
  noneOf,
  items: ( value, schema ) => value.every ( value => schema.test ( value ) ),
  max: ( value, max ) => value.length <= max,
  min: ( value, min ) => value.length >= min
};

const FILTERS: Tests<unknown[], ArrayState<unknown[], unknown>> = {
  anyOf,
  noneOf,
  items: ( value, schema ) => {
    for ( let i = value.length - 1; i >= 0; i-- ) {
      try {
        const item = value[i];
        schema.filter ( item );
      } catch {
        value.splice ( i, 1 ); //TODO: This may be a perf footgun, too many items moved around in some edge cases with large arrays
      }
    }
    return true;
  },
  max: TESTS.max,
  min: TESTS.min
};

/* EXPORT */

export default Array;
