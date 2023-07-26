
/* IMPORT */

import Primitive from './primitive';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {isUnknown} from '../utils';
import type {UnknownState, Tests} from '../types';

/* MAIN */

class Unknown extends Primitive<unknown, unknown, UnknownState<unknown, unknown>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): unknown;
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): unknown | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): unknown | boolean {

    return super._filter ( value, TESTS, defaultable, quiet );

  }

  test ( value: unknown ): value is unknown {

    return isUnknown ( value ) && super._test ( value, TESTS );

  }

  /* GENERAL TESTS API */

  anyOf ( values: unknown[] ): Unknown {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: unknown[] ): Unknown {

    return this.with ({ noneOf: values });

  }

}

/* UTILITIES */

const TESTS: Tests<unknown, UnknownState<unknown, unknown>> = {
  anyOf,
  noneOf
};

/* INIT */

Registry.register ( 'unknown', Unknown );

/* EXPORT */

export default Unknown;
