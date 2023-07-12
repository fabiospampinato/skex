
/* IMPORT */

import Abstract from './abstract';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {isString, resolve} from '../utils';
import type {StringState, FunctionMaybe, Tests} from '../types';

/* MAIN */

class String extends Abstract<string, string, StringState<string, string>> {

  /* MATCHING API */

  filter ( value: unknown ): string {

    return super.filter ( value, TESTS );

  }

  test ( value: unknown ): value is string {

    return isString ( value ) && super.test ( value, TESTS );

  }

  /* GENERAL TESTS API */

  anyOf ( values: string[] ): String {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: string[] ): String {

    return this.with ({ noneOf: values });

  }

  nullable (): Nullable<string> {

    return new Nullable ({ nullable: [this] });

  }

  optional (): Optional<string> {

    return new Optional ({ optional: [this] });

  }

  /* SPECIFIC TESTS API */

  length ( value: number ): String {

    return this.with ({ min: value, max: value });

  }

  matches ( value: RegExp ): String { //TODO: Support function also, though it can't work with JSON Schema, maybe split this between pattern and matches, and the latter throws

    return this.with ({ matches: value });

  }

  max ( value: FunctionMaybe<number> ): String {

    return this.with ({ max: value });

  }

  min ( value: FunctionMaybe<number> ): String {

    return this.with ({ min: value });

  }

}

/* UTILITIES */

const TESTS: Tests<string, StringState<string, string>> = {
  anyOf,
  noneOf,
  matches: ( value, re ) => re.test ( value ),
  max: ( value, max ) => value.length <= resolve ( max ),
  min: ( value, min ) => value.length >= resolve ( min )
};

/* EXPORT */

export default String;
