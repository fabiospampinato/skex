
/* IMPORT */

import Abstract from './abstract';
import Nullable from './nullable';
import Optional from './optional';
import {anyOf, noneOf} from '../tests';
import {isBigInt} from '../utils';
import type {BigIntState, Tests} from '../types';

/* MAIN */

class BigInt extends Abstract<bigint, bigint, BigIntState<bigint>> {

  /* MATCHING API */

  filter ( value: unknown ): bigint {

    return super.filter ( value, TESTS );

  }

  test ( value: unknown ): value is bigint {

    return isBigInt ( value ) && super.test ( value, TESTS );

  }

  /* GENERAL TESTS API */

  anyOf ( values: bigint[] ): BigInt {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: bigint[] ): BigInt {

    return this.with ({ noneOf: values });

  }

  nullable (): Nullable<bigint> {

    return new Nullable ({ nullable: [this] });

  }

  optional (): Optional<bigint> {

    return new Optional ({ optional: [this] });

  }

  /* SPECIFIC TESTS API */

  gt ( value: bigint ): BigInt {

    return this.with ({ gt: value });

  }

  gte ( value: bigint ): BigInt {

    return this.with ({ gte: value });

  }

  lt ( value: bigint ): BigInt {

    return this.with ({ lt: value });

  }

  lte ( value: bigint ): BigInt {

    return this.with ({ lte: value });

  }

  max ( value: bigint ): BigInt {

    return this.with ({ lte: value });

  }

  min ( value: bigint ): BigInt {

    return this.with ({ gte: value });

  }

  multipleOf ( value: bigint ): BigInt {

    return this.with ({ multipleOf: value });

  }

}

/* UTILITIES */

const TESTS: Tests<bigint, BigIntState<bigint>> = {
  anyOf,
  noneOf,
  gt: ( value, gt ) => value > gt,
  gte: ( value, gte ) => value >= gte,
  lt: ( value, lt ) => value < lt,
  lte: ( value, lte ) => value <= lte,
  multipleOf: ( value, multipleOf ) => value % multipleOf === 0n
};

/* EXPORT */

export default BigInt;
