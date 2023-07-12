
/* IMPORT */

import {exit} from '../utils';
import type {AbstractState, States, Tests} from '../types';

/* MAIN */

class Abstract<BaseType extends unknown, FullType extends BaseType, State extends AbstractState<BaseType, FullType>> {

  /* VARIABLES */

  protected states: States<State>;

  /* CONSTRUCTOR */

  constructor ( state: States<State> ) { //TODO: Ugly that we need to pass it pre-arrayed objects

    this.states = state;

  }

  /* PUBLIC API */

  filter ( value: Parameters<this['test']>[0], tests: Tests<BaseType, State> ): FullType {

    if ( this.test ( value, tests ) ) {

      return value;

    } else {

      return exit ( 'Filtering failed' );

    }

  }

  test ( value: BaseType, tests: Tests<BaseType, State> ): value is FullType {

    for ( const key in this.states ) {

      const states = this.states[key];

      if ( states === undefined || states === null ) continue;

      const test = tests[key];
      const success = states.every ( state => test ( value, state ) );

      if ( !success ) return false;

    }

    return true;

  }

  with ( state: Partial<State> ): this {

    const statesNext = { ...this.states }; //TODO: Clone internal arrays also..., but skip functions

    for ( const key in state ) {

      const value = state[key];

      if ( value === undefined ) continue;

      statesNext[key] ||= [];
      statesNext[key].push ( value );

    }

    return new this.constructor ( statesNext );

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
