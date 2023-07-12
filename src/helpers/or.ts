
/* IMPORT */

import Or from '../nodes/or';
import type {Infer, Schema} from '../types';

/* MAIN */

function or <S0 extends Schema> ( options: [S0] ): Or<Infer<S0>>;
function or <S0 extends Schema, S1 extends Schema> ( options: [S0, S1] ): Or<Infer<S0> | Infer<S1>>;
function or <S0 extends Schema, S1 extends Schema, S2 extends Schema> ( options: [S0, S1, S2] ): Or<Infer<S0> | Infer<S1> | Infer<S2>>;
function or <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema> ( options: [S0, S1, S2, S3] ): Or<Infer<S0> | Infer<S1> | Infer<S2> | Infer<S3>>;
function or <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema> ( options: [S0, S1, S2, S3, S4] ): Or<Infer<S0> | Infer<S1> | Infer<S2> | Infer<S3> | Infer<S4>>;
function or <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema> ( options: [S0, S1, S2, S3, S4, S5] ): Or<Infer<S0> | Infer<S1> | Infer<S2> | Infer<S3> | Infer<S4> | Infer<S5>>;
function or <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema> ( options: [S0, S1, S2, S3, S4, S5, S6] ): Or<Infer<S0> | Infer<S1> | Infer<S2> | Infer<S3> | Infer<S4> | Infer<S5> | Infer<S6>>;
function or <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema> ( options: [S0, S1, S2, S3, S4, S5, S6, S7] ): Or<Infer<S0> | Infer<S1> | Infer<S2> | Infer<S3> | Infer<S4> | Infer<S5> | Infer<S6> | Infer<S7>>;
function or <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema, S8 extends Schema> ( options: [S0, S1, S2, S3, S4, S5, S6, S7, S8] ): Or<Infer<S0> | Infer<S1> | Infer<S2> | Infer<S3> | Infer<S4> | Infer<S5> | Infer<S6> | Infer<S7> | Infer<S8>>;
function or <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema, S8 extends Schema, S9 extends Schema> ( options: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9] ): Or<Infer<S0> | Infer<S1> | Infer<S2> | Infer<S3> | Infer<S4> | Infer<S5> | Infer<S6> | Infer<S7> | Infer<S8> | Infer<S9>>;
function or ( options: Schema[] ): Or<unknown> {

  return new Or ({ options: [options] });

}

/* EXPORT */

export default or;
