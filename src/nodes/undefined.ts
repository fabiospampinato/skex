
/* IMPORT */

import Primitive from './primitive';
import Nullable from './nullable';
import Registry from '../registry';
import {isUndefined} from '../utils';
import type {UndefinedState} from '../types';

/* MAIN */

class Undefined extends Primitive<undefined, undefined, UndefinedState<undefined, undefined>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: boolean = true ): undefined {

    return super._filter ( value, {}, defaultable );

  }

  test ( value: unknown ): value is undefined {

    return isUndefined ( value ) && super._test ( value, {} );

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
