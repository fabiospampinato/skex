
/* IMPORT */

import Primitive from './primitive';
import Nullable from './nullable';
import Registry from '../registry';
import {isUndefined} from '../utils';
import type {UndefinedState} from '../types';

/* MAIN */

class Undefined extends Primitive<undefined, undefined, UndefinedState<undefined, undefined>> {

  /* PUBLIC API */

  filter ( value: unknown ): undefined {

    return super.filter ( value, {} );

  }

  test ( value: unknown ): value is undefined {

    return isUndefined ( value ) && super.test ( value, {} );

  }

  /* GENERAL TESTS API */

  nullable (): Nullable<undefined> {

    return new Nullable ({ nullable: this });

  }

}

/* INIT */

Registry.register ( 'undefined', Undefined );

/* EXPORT */

export default Undefined;
