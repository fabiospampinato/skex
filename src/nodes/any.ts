
/* IMPORT */

import Primitive from './primitive';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {isAny} from '../utils';
import type {AnyState, Tests} from '../types';

/* MAIN */

class Any extends Primitive<any, any, AnyState<any, any>> {

  /* PUBLIC API */

  filter ( value: unknown ): any {

    return super.filter ( value, TESTS );

  }

  test ( value: unknown ): value is any {

    return isAny ( value ) && super.test ( value, TESTS );

  }

  /* GENERAL TESTS API */

  anyOf ( values: any[] ): Any {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: any[] ): Any {

    return this.with ({ noneOf: values });

  }

}

/* UTILITIES */

const TESTS: Tests<any, AnyState<any, any>> = {
  anyOf,
  noneOf
};

/* INIT */

Registry.register ( 'any', Any );

/* EXPORT */

export default Any;
