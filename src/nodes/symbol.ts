
/* IMPORT */

import Primitive from './primitive';
import Nillable from './nillable';
import Nullable from './nullable';
import Optional from './optional';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {isSymbol} from '../utils';
import type {SymbolState, Tests} from '../types';

/* MAIN */

class Symbol extends Primitive<symbol, symbol, SymbolState<symbol, symbol>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): symbol;
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): symbol | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): symbol | boolean {

    return super._filter ( value, TESTS, defaultable, quiet );

  }

  test ( value: unknown ): value is symbol {

    return isSymbol ( value ) && super._test ( value, TESTS );

  }

  /* GENERAL TESTS API */

  anyOf ( values: symbol[] ): Symbol {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: symbol[] ): Symbol {

    return this.with ({ noneOf: values });

  }

  nillable (): Nillable<symbol> {

    return new Nillable ({ nillable: this });

  }

  nullable (): Nullable<symbol> {

    return new Nullable ({ nullable: this });

  }

  optional (): Optional<symbol> {

    return new Optional ({ optional: this });

  }

}

/* UTILITIES */

const TESTS: Tests<symbol, SymbolState<symbol, symbol>> = {
  anyOf,
  noneOf
};

/* INIT */

Registry.register ( 'symbol', Symbol );

/* EXPORT */

export default Symbol;
