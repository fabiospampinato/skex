
/* IMPORT */

import Primitive from './primitive';
import Nillable from './nillable';
import Nullable from './nullable';
import Optional from './optional';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {isBigInt, resolve} from '../utils';
import type {BigIntState, FunctionMaybe, Tests} from '../types';

/* MAIN */

class BigInt extends Primitive<bigint, bigint, BigIntState<bigint, bigint>> {

  /* PUBLIC API */

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

  nillable (): Nillable<bigint> {

    return new Nillable ({ nillable: this });

  }

  nullable (): Nullable<bigint> {

    return new Nullable ({ nullable: this });

  }

  optional (): Optional<bigint> {

    return new Optional ({ optional: this });

  }

  /* SPECIFIC TESTS API */

  gt ( value: FunctionMaybe<bigint> ): BigInt {

    return this.with ({ gt: value });

  }

  gte ( value: FunctionMaybe<bigint> ): BigInt {

    return this.with ({ gte: value });

  }

  lt ( value: FunctionMaybe<bigint> ): BigInt {

    return this.with ({ lt: value });

  }

  lte ( value: FunctionMaybe<bigint> ): BigInt {

    return this.with ({ lte: value });

  }

  max ( value: FunctionMaybe<bigint> ): BigInt {

    return this.with ({ lte: value });

  }

  min ( value: FunctionMaybe<bigint> ): BigInt {

    return this.with ({ gte: value });

  }

  multipleOf ( value: FunctionMaybe<bigint> ): BigInt {

    return this.with ({ multipleOf: value });

  }

}

/* UTILITIES */

const TESTS: Tests<bigint, BigIntState<bigint, bigint>> = {
  anyOf,
  noneOf,
  gt: ( value, gt ) => value > resolve ( gt ),
  gte: ( value, gte ) => value >= resolve ( gte ),
  lt: ( value, lt ) => value < resolve ( lt ),
  lte: ( value, lte ) => value <= resolve ( lte ),
  multipleOf: ( value, multipleOf ) => ( value % resolve ( multipleOf ) ) === 0n
};

/* INIT */

Registry.register ( 'bigint', BigInt );

/* EXPORT */

export default BigInt;
