
/* IMPORT */

import Abstract from './abstract';
import {anyOf, noneOf} from '../tests';
import {isUnknown} from '../utils';
import type {UnknownState, Tests} from '../types';

/* MAIN */

class Unknown extends Abstract<unknown, unknown, UnknownState<unknown>> {

  /* MATCHING API */

  filter ( value: unknown ): unknown {

    return super.filter ( value, TESTS );

  }

  test ( value: unknown ): value is unknown {

    return isUnknown ( value ) && super.test ( value, TESTS );

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

const TESTS: Tests<unknown, UnknownState<unknown>> = {
  anyOf,
  noneOf
};

/* EXPORT */

export default Unknown;
