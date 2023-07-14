
/* IMPORT */

import Compound from './compound';
import Nillable from './nillable';
import Nullable from './nullable';
import Optional from './optional';
import Undefined from './undefined';
import {anyOf, noneOf} from '../tests';
import {exit, forOwn, isPlainObject, resolve} from '../utils';
import type {ObjectState, FunctionMaybe, Infer, Schema, Tests, Traverser} from '../types';

/* MAIN */

class Object<T extends {}> extends Compound<{}, T, ObjectState<{}, T, unknown>> {

  /* PUBLIC API */

  filter ( value: unknown ): T {

    if ( !isPlainObject ( value ) ) return exit ( 'Filtering failed' );

    if ( !super.test ( value, FILTERS ) ) return exit ( 'Filtering failed' );

    return value;

  }

  test ( value: unknown ): value is T {

    return isPlainObject ( value ) && super.test ( value, TESTS );

  }

  traverse ( traverser: Traverser, parent?: Schema, key?: string | number ): void {

    traverser ( this, parent, key );

    forOwn ( resolve ( this.state.properties ) || {}, ( property, key ) => {

      property.traverse ( traverser, this, key );

    });

  }

  /* GENERIC TESTS API */

  anyOf ( values: T[] ): Object<T> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: T[] ): Object<T> {

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

  /* SPECIFIC TESTS API */

  properties <Properties extends Record<string, Schema>> ( properties: FunctionMaybe<Properties> ): Object<T & { [K in keyof Properties]: Infer<Properties[K]> }> {

    return this.with ({ properties });

  }

}

/* UTILITIES */

//TODO: Ensure that the properties filter actually works
//TODO: Support "extend" method

const TESTS: Tests<Record<string, unknown>, ObjectState<Record<string, unknown>, Record<string, unknown>, unknown>> = {
  anyOf,
  noneOf,
  properties: ( value, schemas ) => {
    const properties = resolve ( schemas );
    // for ( const key in ctx.value ) {
    //   if ( key in schemas ) continue;
    //   return false; // Extra "key"
    // }
    // for ( const key in schemas ) {
    //   if ( key in value ) continue;
    //   if ( !schemas[key].req ) continue;
    //   return false; // Missing "key"
    // }
    for ( const key in properties ) {
      const schema = properties[key];
      const item = value[key];
      if ( !schema.test ( item ) ) return false;
    }
    return true;
  },
};

const FILTERS: Tests<Record<string, unknown>, ObjectState<Record<string, unknown>, Record<string, unknown>, unknown>> = {
  anyOf,
  noneOf,
  properties: ( value, schemas ) => {
    const properties = resolve ( schemas );
    // for ( const key in ctx.value ) {
    //   if ( key in schemas ) continue;
    //   return false; // Extra "key"
    // }
    // for ( const key in schemas ) {
    //   if ( key in value ) continue;
    //   if ( !schemas[key].req ) continue;
    //   return false; // Missing "key"
    // }
    const keys = new Set<string> ();
    for ( const key in properties ) {
      const schema = properties[key];
      const item = value[key];
      try {
        schema.filter ( item );
        keys.add ( key );
      } catch ( error: unknown ) {
        if ( !( schema instanceof Optional ) && !( schema instanceof Undefined ) ) {
          throw error;
        }
      }
    }
    for ( const key in value ) {
      if ( keys.has ( key ) ) continue;
      delete value[key];
    }
    return true;
  },
};


/* EXPORT */

export default Object;
