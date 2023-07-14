
/* IMPORT */

import Primitive from './primitive';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {isFunction, isString, resolve} from '../utils';
import type {StringState, FunctionMaybe, Tests} from '../types';

/* MAIN */

class String<T extends string> extends Primitive<string, T, StringState<string, T>> {

  /* PUBLIC API */

  filter ( value: unknown ): T {

    return super.filter ( value, TESTS );

  }

  test ( value: unknown ): value is T {

    return isString ( value ) && super.test ( value, TESTS );

  }

  /* GENERAL TESTS API */

  anyOf ( values: string[] ): String<T> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: string[] ): String<T> {

    return this.with ({ noneOf: values });

  }

  nullable (): Nullable<T> {

    return new Nullable ({ nullable: this });

  }

  optional (): Optional<T> {

    return new Optional ({ optional: this });

  }

  /* SPECIFIC TESTS API */

  length ( value: number ): String<T> {

    return this.with ({ min: value, max: value });

  }

  matches <U extends string> ( guard: ( value: string ) => value is U ): String<T & U>;
  matches ( value: ( guard: string ) => boolean ): String<T>;
  matches ( value: RegExp ): String<T>;
  matches ( value: (( value: string ) => boolean) | RegExp ): String<T> {

    return this.with ({ matches: value });

  }

  max ( value: FunctionMaybe<number> ): String<T> {

    return this.with ({ max: value });

  }

  min ( value: FunctionMaybe<number> ): String<T> {

    return this.with ({ min: value });

  }

}

/* UTILITIES */

const TESTS: Tests<string, StringState<string, string>> = {
  anyOf,
  noneOf,
  matches: ( value, matcher ) => isFunction ( matcher ) ? matcher ( value ) : matcher.test ( value ),
  max: ( value, max ) => value.length <= resolve ( max ),
  min: ( value, min ) => value.length >= resolve ( min )
};

/* EXPORT */

export default String;
