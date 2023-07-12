
/* IMPORT */

import Abstract from './abstract';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {isNaN, isNumber} from '../utils';
import type {NumberState, Tests} from '../types';

/* MAIN */

class Number extends Abstract<number, number, NumberState<number>> {

  /* MATCHING API */

  filter ( value: unknown ): number {

    return super.filter ( value, TESTS );

  }

  test ( value: unknown ): value is number {

    return isNumber ( value ) && !isNaN ( value ) && super.test ( value, TESTS );

  }

  /* GENERAL TESTS API */

  anyOf ( values: number[] ): Number {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: number[] ): Number {

    return this.with ({ noneOf: values });

  }

  nullable (): Nullable<number> {

    return new Nullable ({ nullable: [this] });

  }

  optional (): Optional<number> {

    return new Optional ({ optional: [this] });

  }

  /* SPECIFIC TESTS API */

  gt ( value: number ): Number {

    return this.with ({ gt: value });

  }

  gte ( value: number ): Number {

    return this.with ({ gte: value });

  }

  lt ( value: number ): Number {

    return this.with ({ lt: value });

  }

  lte ( value: number ): Number {

    return this.with ({ lte: value });

  }

  max ( value: number ): Number {

    return this.with ({ lte: value });

  }

  min ( value: number ): Number {

    return this.with ({ gte: value });

  }

  multipleOf ( value: number ): Number {

    return this.with ({ multipleOf: value });

  }

}

/* UTILITIES */

const TESTS: Tests<number, NumberState<number>> = {
  anyOf,
  noneOf,
  gt: ( value, gt ) => value > gt,
  gte: ( value, gte ) => value >= gte,
  lt: ( value, lt ) => value < lt,
  lte: ( value, lte ) => value <= lte,
  multipleOf: ( value, multipleOf ) => value % multipleOf === 0
};

/* EXPORT */

export default Number;
