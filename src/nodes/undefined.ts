
/* IMPORT */

import Abstract from './abstract';
import Nullable from './nullable';
import {isUndefined} from '../utils';
import type {UndefinedState} from '../types';

/* MAIN */

class Undefined extends Abstract<undefined, undefined, UndefinedState<undefined>> {

  /* MATCHING API */

  filter ( value: unknown ): undefined {

    return super.filter ( value, {} );

  }

  test ( value: unknown ): value is undefined {

    return isUndefined ( value ) && super.test ( value, {} );

  }

  /* GENERAL TESTS API */

  nullable (): Nullable<undefined> {

    return new Nullable ({ nullable: [this] });

  }

}

/* EXPORT */

export default Undefined;
