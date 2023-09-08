
/* IMPORT */

import Compound from './compound';
import {pick} from '../utils';
import type {AbstractState, Schema} from '../types';

/* MAIN */

// This node is used both for brand checking and to cleanly inherit some state from the parent schema

class CompoundWithState<BaseType extends unknown, FullType extends BaseType, State extends AbstractState<BaseType, FullType>> extends Compound<BaseType, FullType, State> {

  /* CONSTRUCTOR */

  constructor ( state: State, parent: Schema ) {

    const parentState = pick ( parent.get (), ['default', 'title', 'description'] );

    super ({ ...parentState, ...state });

  }

}

/* EXPORT */

export default CompoundWithState;
