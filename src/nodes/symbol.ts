
/* IMPORT */

import Abstract from './abstract';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {isSymbol} from '../utils';
import type {SymbolState, Tests} from '../types';

/* MAIN */

class Symbol extends Abstract<symbol, symbol, SymbolState<symbol, symbol>> {

  /* MATCHING API */

  filter ( value: unknown ): symbol {

    return super.filter ( value, TESTS );

  }

  test ( value: unknown ): value is symbol {

    return isSymbol ( value ) && super.test ( value, TESTS );

  }

  /* GENERAL TESTS API */

  anyOf ( values: symbol[] ): Symbol {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: symbol[] ): Symbol {

    return this.with ({ noneOf: values });

  }

  nullable (): Nullable<symbol> {

    return new Nullable ({ nullable: [this] });

  }

  optional (): Optional<symbol> {

    return new Optional ({ optional: [this] });

  }

}

/* UTILITIES */

const TESTS: Tests<symbol, SymbolState<symbol, symbol>> = {
  anyOf,
  noneOf
};

/* EXPORT */

export default Symbol;
