
/* IMPORT */

import And from '../nodes/and';
import type {Infer, Schema} from '../types';

/* MAIN */

function and <S0 extends Schema> ( options: [S0] ): And<Infer<S0>>;
function and <S0 extends Schema, S1 extends Schema> ( options: [S0, S1] ): And<Infer<S0> & Infer<S1>>;
function and <S0 extends Schema, S1 extends Schema, S2 extends Schema> ( options: [S0, S1, S2] ): And<Infer<S0> & Infer<S1> & Infer<S2>>;
function and <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema> ( options: [S0, S1, S2, S3] ): And<Infer<S0> & Infer<S1> & Infer<S2> & Infer<S3>>;
function and <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema> ( options: [S0, S1, S2, S3, S4] ): And<Infer<S0> & Infer<S1> & Infer<S2> & Infer<S3> & Infer<S4>>;
function and <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema> ( options: [S0, S1, S2, S3, S4, S5] ): And<Infer<S0> & Infer<S1> & Infer<S2> & Infer<S3> & Infer<S4> & Infer<S5>>;
function and <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema> ( options: [S0, S1, S2, S3, S4, S5, S6] ): And<Infer<S0> & Infer<S1> & Infer<S2> & Infer<S3> & Infer<S4> & Infer<S5> & Infer<S6>>;
function and <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema> ( options: [S0, S1, S2, S3, S4, S5, S6, S7] ): And<Infer<S0> & Infer<S1> & Infer<S2> & Infer<S3> & Infer<S4> & Infer<S5> & Infer<S6> & Infer<S7>>;
function and <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema, S8 extends Schema> ( options: [S0, S1, S2, S3, S4, S5, S6, S7, S8] ): And<Infer<S0> & Infer<S1> & Infer<S2> & Infer<S3> & Infer<S4> & Infer<S5> & Infer<S6> & Infer<S7> & Infer<S8>>;
function and <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema, S8 extends Schema, S9 extends Schema> ( options: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9] ): And<Infer<S0> & Infer<S1> & Infer<S2> & Infer<S3> & Infer<S4> & Infer<S5> & Infer<S6> & Infer<S7> & Infer<S8> & Infer<S9>>;
function and ( options: Schema[] ): And<unknown> {

  return new And ({ options });

}

/* EXPORT */

export default and;
