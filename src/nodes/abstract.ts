
/* IMPORT */

import {cloneDeep} from 'duper';
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

  /* PROTECTED APIS */

  protected _filterDefault ( defaultable: boolean ): FullType {

    if ( defaultable && this.state.default !== undefined ) {

      return cloneDeep ( this.state.default );

    } else {

      return exit ( 'Filtering failed' );

    }

  }

  protected _filter ( value: Parameters<this['test']>[0], tests: Tests<BaseType, State>, defaultable: boolean ): FullType {

    if ( this.test ( value, tests ) ) {

      return value;

    } else {

      return this._filterDefault ( defaultable );

    }

  }

  protected _test ( value: BaseType, tests: Tests<BaseType, State> ): value is FullType {

    for ( const key in this.state ) {

      const state = this.state[key];

      if ( state === undefined || state === null ) continue;

      const test = tests[key];

      if ( !test ) continue;

      const success = test ( value, state );

      if ( !success ) return false;

    }

    return true;

  }

  /* PUBLIC API */

  filter ( value: Parameters<this['test']>[0], defaultable: boolean ): FullType {

    return exit ( 'Unimplemented' );

  }

  get (): State;
  get <K extends keyof State> ( state: K ): State[K];
  get <K extends keyof State> ( state?: K ): State | State[K] {

    return state ? this.state[state] : this.state;

  }

  test ( value: BaseType, tests: Tests<BaseType, State> ): value is FullType {

    return exit ( 'Unimplemented' );

  }

  traverse ( traverser: Traverser, parent?: Schema, key?: string | number ): void {

    traverser ( this, parent, key );

  }

  with ( state: Partial<State> ): this {

    const stateNext = { ...this.state };

    for ( const key in state ) {

      if ( key in stateNext ) return exit ( `Duplicated "${key}" check` );

      const value = state[key];

      if ( value === undefined ) continue;

      stateNext[key] = value;

    }

    return new this.constructor ( stateNext );

  }

  /* GENERIC TESTS API */

  default ( value: Exclude<FullType, undefined> ): this {

    return this.with ({ default: value });

  }

  description ( value: string ): this {

    return this.with ({ description: value });

  }

}

/* EXPORT */

export default Abstract;
