
/* IMPORT */

import Compound from './compound';
import Nillable from './nillable';
import Nullable from './nullable';
import Optional from './optional';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {isArray, resolve} from '../utils';
import type {ArrayState, FunctionMaybe, Schema, Tests, Traverser} from '../types';

/* MAIN */

class Array<T extends unknown> extends Compound<unknown[], T[], ArrayState<unknown[], T[], unknown>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): T[];
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): T[] | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): T[] | boolean {

    if ( !isArray ( value ) ) return this._filterDefault ( defaultable, quiet );

    if ( !super._test ( value, FILTERS ) ) return this._filterDefault ( defaultable, quiet );

    return value;

  }

  test ( value: unknown ): value is T[] {

    return isArray ( value ) && super._test ( value, TESTS );

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
      const item = value[i];
      const filtered = items.filter ( item, false, true );
      if ( !filtered ) {
        value.splice ( i, 1 ); //TODO: This may be a perf issue, too many items moved around in some edge cases with large arrays
      }
    }
    return true;
  },
  max: TESTS.max,
  min: TESTS.min
};

/* INIT */

Registry.register ( 'array', Array );

/* EXPORT */

export default Array;
