
/* IMPORT */

import {exit} from '../utils';
import type {AbstractState, Schema, Tests, Traverser} from '../types';

/* MAIN */

class Abstract<BaseType extends unknown, FullType extends BaseType, State extends AbstractState<BaseType, FullType>> {

  /* VARIABLES */

  protected state: State;

  /* CONSTRUCTOR */

  constructor ( state: State ) {

    this.state = state;

  }

  /* PUBLIC API */

  filter ( value: Parameters<this['test']>[0], tests: Tests<BaseType, State> ): FullType {

    if ( this.test ( value, tests ) ) {

      return value;

    } else {

      return exit ( 'Filtering failed' );

    }

  }

  get (): State;
  get <K extends keyof State> ( state: K ): State[K];
  get <K extends keyof State> ( state?: K ): State | State[K] {

    return state ? this.state[state] : this.state;

  }

  test ( value: BaseType, tests: Tests<BaseType, State> ): value is FullType {

    for ( const key in this.state ) {

      const state = this.state[key];

      if ( state === undefined || state === null ) continue;

      const test = tests[key];
      const success = test ( value, state );

      if ( !success ) return false;

    }

    return true;

  }

  traverse ( traverser: Traverser, parent?: Schema, key?: string | number ): void {

    traverser ( this, parent, key );

  }

  with ( state: Partial<State> ): this {

    const stateNext = { ...this.state };

    for ( const key in state ) {

      if ( key in stateNext ) return exit ( `Duplicated "${key}" check` );

      const value = state[key];

      if ( value === undefined || value === null ) continue;

      stateNext[key] = value;

    }

    return new this.constructor ( stateNext );

  }

  /* GENERIC TESTS API */

  default ( value: FullType ): this {

    return this.with ({ default: value });

  }

  description ( value: string ): this {

    return this.with ({ description: value });

  }

}

/* EXPORT */

export default Abstract;
