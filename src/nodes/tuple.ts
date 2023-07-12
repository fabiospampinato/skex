
/* IMPORT */

import Abstract from './abstract';
import Nullable from './nullable';
import Optional from './optional';
import Undefined from './undefined';
import {anyOf, noneOf} from '../tests';
import {exit, findLastIndex, isArray, resolve} from '../utils';
import type {TupleState, FunctionMaybe, Infer, Schema, Tests} from '../types';

/* MAIN */

//TODO: Support variadic tuples (.rest method)

class Tuple<T extends unknown[] = []> extends Abstract<unknown[], T, TupleState<T, unknown>> {

  /* MATCHING API */

  filter ( value: unknown ): T {

    if ( !isArray ( value ) ) exit ( 'Filtering failed' );

    return super.filter ( value, FILTERS );

  }

  test ( value: unknown ): value is T {

    return isArray ( value ) && super.test ( value, TESTS );

  }

  /* GENERIC TESTS API */

  anyOf ( values: T[] ): Tuple<T> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: T[] ): Tuple<T> {

    return this.with ({ noneOf: values });

  }

  nullable (): Nullable<T> {

    return new Nullable ({ nullable: [this] });

  }

  optional (): Optional<T> {

    return new Optional ({ optional: [this] });

  }

  /* SPECIFIC TESTS API */

  items <S0 extends Schema> ( items: FunctionMaybe<[S0]> ): Tuple<[Infer<S0>]>;
  items <S0 extends Schema, S1 extends Schema> ( items: FunctionMaybe<[S0, S1]> ): Tuple<[Infer<S0>, Infer<S1>]>;
  items <S0 extends Schema, S1 extends Schema, S2 extends Schema> ( items: FunctionMaybe<[S0, S1, S2]> ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>]>;
  items <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema> ( items: FunctionMaybe<[S0, S1, S2, S3]> ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>]>;
  items <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema> ( items: FunctionMaybe<[S0, S1, S2, S3, S4]> ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>]>;
  items <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema> ( items: FunctionMaybe<[S0, S1, S2, S3, S4, S5]> ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>, Infer<S5>]>;
  items <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema> ( items: FunctionMaybe<[S0, S1, S2, S3, S4, S5, S6]> ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>, Infer<S5>, Infer<S6>]>;
  items <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema> ( items: FunctionMaybe<[S0, S1, S2, S3, S4, S5, S6, S7]> ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>, Infer<S5>, Infer<S6>, Infer<S7>]>;
  items <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema, S8 extends Schema> ( items: FunctionMaybe<[S0, S1, S2, S3, S4, S5, S6, S7, S8]> ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>, Infer<S5>, Infer<S6>, Infer<S7>, Infer<S8>]>;
  items <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema, S8 extends Schema, S9 extends Schema> ( items: FunctionMaybe<[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9]> ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>, Infer<S5>, Infer<S6>, Infer<S7>, Infer<S8>, Infer<S9>]>;
  items ( items: FunctionMaybe<Schema[]> ): Tuple<unknown[]>;
  items ( items: FunctionMaybe<Schema[]> ): Tuple<unknown[]> {

    return this.with ({ items });

  }

  length ( value: FunctionMaybe<number> ): Tuple<T> {

    return this.with ({ length: value });

  }

}

/* UTILITIES */

const TESTS: Tests<unknown[], TupleState<unknown[], unknown>> = {
  anyOf,
  noneOf,
  items: ( value, schemas ) => {
    const items = resolve ( schemas );
    const maxLength = items.length;
    if ( value.length > maxLength ) return false;
    const minLength = findLastIndex ( items, schema => !( schema instanceof Optional ) && !( schema instanceof Undefined ) ) + 1; //TODO: This should be more sophisticated, there could be or([ undefined () ]) for example
    if ( value.length < minLength ) return false;
    for ( let i = 0, l = items.length; i < l; i++ ) {
      const schema = items[i];
      const item = value[i];
      if ( !schema.test ( item ) ) return false;
    }
    return true;
  },
  length: ( value, length ) => {
    return value.length === resolve ( length );
  }
};

const FILTERS: Tests<unknown[], TupleState<unknown[], unknown>> = {
  anyOf,
  noneOf,
  items: ( value, schemas ) => {
    const items = resolve ( schemas );
    const maxLength = items.length;
    if ( value.length > maxLength ) return false;
    const minLength = findLastIndex ( items, schema => !( schema instanceof Optional ) && !( schema instanceof Undefined ) ) + 1; //TODO: This should be more sophisticated, there could be or([ undefined () ]) for example
    if ( value.length < minLength ) return false;
    for ( let i = 0, l = items.length; i < l; i++ ) {
      const schema = items[i];
      const item = value[i];
      schema.filter ( item );
    }
    return true;
  },
  length: TESTS.length
};

/* EXPORT */

export default Tuple;
