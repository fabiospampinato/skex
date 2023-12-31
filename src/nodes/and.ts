
/* IMPORT */

import Compound from './compound';
import Nillable from './nillable';
import Nullable from './nullable';
import Optional from './optional';
import Registry from '../registry';
import {anyOf, noneOf} from '../tests';
import {exit} from '../utils';
import type {AndState, Schema, Tests, Traverser} from '../types';

/* MAIN */

class And<T> extends Compound<unknown, T, AndState<T, T, unknown>> {

  /* PUBLIC API */

  filter ( value: unknown, defaultable: false, quiet: true ): boolean;
  filter ( value: unknown, defaultable?: boolean, quiet?: false ): T;
  filter ( value: unknown, defaultable?: boolean, quiet?: boolean ): T | boolean;
  filter ( value: unknown, defaultable: boolean = true, quiet: boolean = false ): T | boolean {

    return exit ( 'The "and" operator does not support filtering' ); // Probably this doesn't make a lot of sense to support?

  }

  test ( value: unknown ): value is T {

    return super._test ( value, TESTS );

  }

  traverse ( traverser: Traverser, parent?: Schema, key?: string | number ): void {

    traverser ( this, parent, key );

    this.state.options.forEach ( option => {

      option.traverse ( traverser, this );

    });

  }

  /* GENERIC TESTS API */

  anyOf ( values: T[] ): And<T> {

    return this.with ({ anyOf: values });

  }

  noneOf ( values: T[] ): And<T> {

    return this.with ({ noneOf: values });

  }

  nillable (): Nillable<T> {

    return new Nillable ({ nillable: this });

  }

  nullable (): Nullable<T> {

    return new Nullable ({ nullable: this });

  }

  optional (): Optional<T> {

    return new Optional ({ optional: this });

  }

}

/* UTILITIES */

const TESTS: Tests<unknown, AndState<unknown, unknown, unknown>> = {
  anyOf,
  noneOf,
  options: ( value, schemas ) => schemas.every ( option => option.test ( value ) )
};

/* INIT */

Registry.register ( 'and', And );

/* EXPORT */

export default And;
