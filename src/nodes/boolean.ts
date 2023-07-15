
/* IMPORT */

import Primitive from './primitive';
import Nillable from './nillable';
import Nullable from './nullable';
import Optional from './optional';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {isBoolean} from '../utils';
import type {BooleanState, Tests} from '../types';

/* MAIN */

class Boolean extends Primitive<boolean, boolean, BooleanState<boolean, boolean>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: boolean = true ): boolean {

    return super._filter ( value, TESTS, defaultable );

  }

  test ( value: unknown ): value is boolean {

    return isBoolean ( value ) && super._test ( value, TESTS );

  }

  /* GENERAL TESTS API */

  anyOf ( values: boolean[] ): Boolean {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: boolean[] ): Boolean {

    return this.with ({ noneOf: values });

  }

  nillable (): Nillable<boolean> {

    return new Nillable ({ nillable: this });

  }

  nullable (): Nullable<boolean> {

    return new Nullable ({ nullable: this });

  }

  optional (): Optional<boolean> {

    return new Optional ({ optional: this });

  }

}

/* UTILITIES */

const TESTS: Tests<boolean, BooleanState<boolean, boolean>> = {
  anyOf,
  noneOf
};

/* INIT */

Registry.register ( 'boolean', Boolean );

/* EXPORT */

export default Boolean;
