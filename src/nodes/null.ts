
/* IMPORT */

import Primitive from './primitive';
import Optional from './optional';
import {isNull} from '../utils';
import type {NullState} from '../types';

/* MAIN */

class Null extends Primitive<null, null, NullState<null, null>> {

  /* PUBLIC API */

  filter ( value: unknown ): null {

    return super.filter ( value, {} );

  }

  test ( value: unknown ): value is null {

    return isNull ( value ) && super.test ( value, {} );

  }

  /* GENERAL TESTS API */

  optional (): Optional<null> {

    return new Optional ({ optional: this });

  }

}

/* EXPORT */

export default Null;
