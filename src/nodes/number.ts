
/* IMPORT */

import Primitive from './primitive';
import Nillable from './nillable';
import Nullable from './nullable';
import Optional from './optional';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {isFinite, isInteger, isNaN, isNumber, resolve} from '../utils';
import type {NumberState, FunctionMaybe, Tests} from '../types';

/* MAIN */

class Number extends Primitive<number, number, NumberState<number, number>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): number;
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): number | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): number | boolean {

    return super._filter ( value, TESTS, defaultable, quiet );

  }

  test ( value: unknown ): value is number {

    return isNumber ( value ) && !isNaN ( value ) && super._test ( value, TESTS );

  }

  /* GENERAL TESTS API */

  anyOf ( values: number[] ): Number {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: number[] ): Number {

    return this.with ({ noneOf: values });

  }

  nillable (): Nillable<number> {

    return new Nillable ({ nillable: this });

  }

  nullable (): Nullable<number> {

    return new Nullable ({ nullable: this });

  }

  optional (): Optional<number> {

    return new Optional ({ optional: this });

  }

  /* SPECIFIC TESTS API */

  finite (): Number {

    return this.with ({ finite: true });

  }

  gt ( value: FunctionMaybe<number> ): Number {

    return this.with ({ gt: value });

  }

  gte ( value: FunctionMaybe<number> ): Number {

    return this.with ({ gte: value });

  }

  integer (): Number {

    return this.with ({ integer: true });

  }

  lt ( value: FunctionMaybe<number> ): Number {

    return this.with ({ lt: value });

  }

  lte ( value: FunctionMaybe<number> ): Number {

    return this.with ({ lte: value });

  }

  max ( value: FunctionMaybe<number> ): Number {

    return this.with ({ lte: value });

  }

  min ( value: FunctionMaybe<number> ): Number {

    return this.with ({ gte: value });

  }

  multipleOf ( value: FunctionMaybe<number> ): Number {

    return this.with ({ multipleOf: value });

  }

}

/* UTILITIES */

const TESTS: Tests<number, NumberState<number, number>> = {
  anyOf,
  noneOf,
  finite: value => isFinite ( value ),
  gt: ( value, gt ) => value > resolve ( gt ),
  gte: ( value, gte ) => value >= resolve ( gte ),
  integer: value => isInteger ( value ),
  lt: ( value, lt ) => value < resolve ( lt ),
  lte: ( value, lte ) => value <= resolve ( lte ),
  multipleOf: ( value, multipleOf ) => ( value % resolve ( multipleOf ) ) === 0
};

/* INIT */

Registry.register ( 'number', Number );

/* EXPORT */

export default Number;
