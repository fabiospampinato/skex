
/* IMPORT */

import Primitive from './primitive';
import Nullable from './nullable';
import Registry from '../registry';
import {isUndefined} from '../utils';
import type {UndefinedState} from '../types';

/* MAIN */

class Undefined extends Primitive<undefined, undefined, UndefinedState<undefined, undefined>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): undefined;
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): undefined | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): undefined | boolean {

    return super._filter ( value, {}, defaultable, quiet );

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
