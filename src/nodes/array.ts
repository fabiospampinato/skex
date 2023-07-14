
/* IMPORT */

import Compound from './compound';
import Nillable from './nillable';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {exit, isArray, resolve} from '../utils';
import type {ArrayState, FunctionMaybe, Schema, Tests, Traverser} from '../types';

/* MAIN */

class Array<T extends unknown> extends Compound<unknown[], T[], ArrayState<unknown[], T[], unknown>> {

  /* PUBLIC API */

  filter ( value: unknown ): T[] {

    if ( !isArray ( value ) ) return exit ( 'Filtering failed' );

    if ( !super.test ( value, FILTERS ) ) return exit ( 'Filtering failed' );

    return value;

  }

  test ( value: unknown ): value is T[] {

    return isArray ( value ) && super.test ( value, TESTS );

  }

  traverse ( traverser: Traverser, parent?: Schema, key?: string | number ): void {

    traverser ( this, parent, key );

    resolve ( this.state.items )?.traverse ( traverser, this );

  }

  /* GENERIC TESTS API */

  anyOf ( values: T[][] ): Array<T> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: T[][] ): Array<T> {

    return this.with ({ noneOf: values });

  }

  nillable (): Nillable<T[]> {

    return new Nillable ({ nillable: this });

  }

  nullable (): Nullable<T[]> {

    return new Nullable ({ nullable: this });

  }

  optional (): Optional<T[]> {

    return new Optional ({ optional: this });

  }

  /* SPECIFIC TESTS API */

  items <U> ( items: FunctionMaybe<Schema<U>> ): Array<T & U> {

    return this.with ({ items });

  }

  length ( value: FunctionMaybe<number> ): Array<T> {

    return this.with ({ min: value, max: value });

  }

  max ( value: FunctionMaybe<number> ): Array<T> {

    return this.with ({ max: value });

  }

  min ( value: FunctionMaybe<number> ): Array<T> {

    return this.with ({ min: value });

  }

}

/* UTILITIES */

const TESTS: Tests<unknown[], ArrayState<unknown[], unknown[], unknown>> = {
  anyOf,
  noneOf,
  items: ( value, schema ) => {
    const items = resolve ( schema );
    return value.every ( value => items.test ( value ) )
  },
  max: ( value, max ) => {
    return value.length <= resolve ( max );
  },
  min: ( value, min ) => {
    return value.length >= resolve ( min );
  }
};

const FILTERS: Tests<unknown[], ArrayState<unknown[], unknown[], unknown>> = {
  anyOf,
  noneOf,
  items: ( value, schema ) => {
    const items = resolve ( schema );
    for ( let i = value.length - 1; i >= 0; i-- ) {
      try {
        const item = value[i];
        items.filter ( item );
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
