
/* IMPORT */

import Primitive from './primitive';
import Optional from './optional';
import Registry from '../registry';
import {isNull} from '../utils';
import type {NullState} from '../types';

/* MAIN */

class Null extends Primitive<null, null, NullState<null, null>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): null;
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): null | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): null | boolean {

    return super._filter ( value, {}, defaultable, quiet );

  }

  test ( value: unknown ): value is null {

    return isNull ( value ) && super._test ( value, {} );

  }

  /* GENERAL TESTS API */

  optional (): Optional<null> {

    return new Optional ({ optional: this });

  }

}

/* INIT */

Registry.register ( 'null', Null );

/* EXPORT */

export default Null;
