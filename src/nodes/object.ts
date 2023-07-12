
/* IMPORT */

import Abstract from './abstract';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {exit, isPlainObject, resolve} from '../utils';
import type {ObjectState, FunctionMaybe, Infer, Schema, Tests} from '../types';

/* MAIN */

class Object<T extends {}> extends Abstract<{}, T, ObjectState<{}, unknown>> {

  /* MATCHING API */

  filter ( value: unknown ): T {

    if ( !isPlainObject ( value ) ) exit ( 'Filtering failed' );

    return super.filter ( value, FILTERS );

  }

  test ( value: unknown ): value is T {

    return isPlainObject ( value ) && super.test ( value, TESTS );

  }

  /* GENERIC TESTS API */

  anyOf ( values: T[] ): Object<T> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: T[] ): Object<T> {

    return this.with ({ noneOf: values });

  }

  nullable (): Nullable<T> {

    return new Nullable ({ nullable: [this] });

  }

  optional (): Optional<T> {

    return new Optional ({ optional: [this] });

  }

  /* SPECIFIC TESTS API */

  properties <Properties extends Record<string, Schema>> ( properties: FunctionMaybe<Properties> ): Object<T & { [K in keyof Properties]: Infer<Properties[K]> }> {

    return this.with ({ properties });

  }

}

/* UTILITIES */

//TODO: Ensure that the properties filter actually works
//TODO: Support regex property names
//TODO: Support "extend" method

const TESTS: Tests<Record<string, unknown>, ObjectState<Record<string, unknown>, unknown>> = {
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

const FILTERS: Tests<Record<string, unknown>, ObjectState<Record<string, unknown>, unknown>> = {
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
      if ( schema.test ( item ) ) return false;
      keys.add ( key );
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
