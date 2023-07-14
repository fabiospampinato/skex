
/* IMPORT */

import Compound from './compound';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {exit, isPlainObject, resolve} from '../utils';
import type {RecordState, FunctionMaybe, Schema, Tests, Traverser} from '../types';

/* MAIN */

class Rec<K extends string, V extends unknown> extends Compound<Record<string, unknown>, Record<K, V>, RecordState<Record<string, unknown>, Record<K, V>, V>> {

  /* PUBLIC API */

  filter ( value: unknown ): Record<K, V> {

    if ( !isPlainObject ( value ) ) return exit ( 'Filtering failed' );

    if ( !super.test ( value, FILTERS ) ) return exit ( 'Filtering failed' );

    return value;

  }

  test ( value: unknown ): value is Record<K, V> {

    return isPlainObject ( value ) && super.test ( value, TESTS );

  }

  traverse ( traverser: Traverser, parent?: Schema, key?: string | number ): void {

    traverser ( this, parent, key );

    resolve ( this.state.keys )?.traverse ( traverser, this );
    resolve ( this.state.values )?.traverse ( traverser, this );

  }

  /* GENERAL TESTS API */

  anyOf ( values: Record<K, V>[] ): Rec<K, V> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: Record<K, V>[] ): Rec<K, V> {

    return this.with ({ noneOf: values });

  }

  nullable (): Nullable<Record<K, V>> {

    return new Nullable ({ nullable: this });

  }

  optional (): Optional<Record<K, V>> {

    return new Optional ({ optional: this });

  }

  /* SPECIFIC TESTS API */

  keys <T extends K> ( keys: FunctionMaybe<Schema<T>> ): Rec<K & T, V> {

    return this.with ({ keys });

  }

  values <T extends V> ( values: FunctionMaybe<Schema<T>> ): Rec<K, V & T> {

    return this.with ({ values });

  }

}

/* UTILITIES */

const TESTS: Tests<Record<string, unknown>, RecordState<Record<string, unknown>, Record<string, unknown>, unknown>> = {
  anyOf,
  noneOf,
  keys ( value, schema ) {
    const keys = resolve ( schema );
    for ( const key in value ) {
      if ( !keys.test ( key ) ) return false;
    }
    return true;
  },
  values ( value, schema ) {
    const values = resolve ( schema );
    for ( const key in value ) {
      const item = value[key];
      if ( !values.test ( item ) ) return false;
    }
    return true;
  }
};

const FILTERS: Tests<Record<string, unknown>, RecordState<Record<string, unknown>, Record<string, unknown>, unknown>> = {
  anyOf,
  noneOf,
  keys ( value, schema ) {
    const keys = resolve ( schema );
    for ( const key in value ) {
      try {
        keys.filter ( key );
      } catch {
        delete value[key];
      }
    }
    return true;
  },
  values ( value, schema ) {
    const values = resolve ( schema );
    for ( const key in value ) {
      const item = value[key];
      try {
        values.filter ( item );
      } catch {
        delete value[key];
      }
    }
    return true;
  }
};

/* EXPORT */

export default Rec;
