
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

  filter ( value: unknown ): boolean {

    return super.filter ( value, TESTS );

  }

  test ( value: unknown ): value is boolean {

    return isBoolean ( value ) && super.test ( value, TESTS );

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
