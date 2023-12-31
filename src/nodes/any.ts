
/* IMPORT */

import Primitive from './primitive';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {isAny} from '../utils';
import type {AnyState, Tests} from '../types';

/* MAIN */

class Any extends Primitive<any, any, AnyState<any, any>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): any;
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): any | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): any | boolean {

    return super._filter ( value, TESTS, defaultable, quiet );

  }

  test ( value: unknown ): value is any {

    return isAny ( value ) && super._test ( value, TESTS );

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
